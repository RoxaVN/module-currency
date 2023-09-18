import { BadRequestException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';
import { sum, uniqWith } from 'lodash-es';

import { serverModule } from '../module.js';
import {
  AccountTransaction,
  CurrencyAccount,
  Transaction,
} from '../entities/index.js';
import {
  AccountNotFoundException,
  InsufficientBalanceException,
  InvalidTotalTransactionAmountException,
} from '../../base/index.js';

@serverModule.injectable()
export class CreateTransactionService extends InjectDatabaseService {
  async handle(request: {
    currencyId: string;
    type?: string;
    originalTransactionId?: string;
    metadata?: Record<string, any>;
    accounts: Array<{
      userId: string;
      amount: number;
      type?: string;
    }>;
  }) {
    const total = sum(request.accounts.map((acc) => acc.amount));
    if (total !== 0) {
      throw new InvalidTotalTransactionAmountException();
    }

    let requestAccounts = request.accounts.map((item) => ({
      userId: item.userId,
      amount: item.amount,
      type: item.type || CurrencyAccount.TYPE_DEFAULT,
      id: '',
    }));
    requestAccounts = uniqWith(
      requestAccounts,
      (a, b) => a.userId === b.userId && a.type === b.type
    );
    // check for duplicate accounts
    if (requestAccounts.length !== request.accounts.length) {
      throw new BadRequestException();
    }

    const accounts = await this.entityManager
      .getRepository(CurrencyAccount)
      .find({
        lock: { mode: 'pessimistic_write' },
        where: requestAccounts.map((item) => ({
          userId: item.userId,
          currencyId: request.currencyId,
          type: item.type,
        })),
      });
    for (const requestAccount of requestAccounts) {
      const account = accounts.find(
        (a) =>
          a.userId === requestAccount.userId && a.type === requestAccount.type
      );
      if (account) {
        account.balance += requestAccount.amount;
        if (account.balance < account.minBalance) {
          throw new InsufficientBalanceException(account.userId, account.type);
        }
        requestAccount.id = account.id;
      }
      throw new AccountNotFoundException(
        requestAccount.userId,
        requestAccount.type
      );
    }
    const transaction = new Transaction();
    Object.assign(transaction, request);

    await this.entityManager.save(transaction);

    await this.entityManager
      .createQueryBuilder(AccountTransaction, 'accountTransaction')
      .insert()
      .values(
        requestAccounts.map((account) => ({
          accountId: account.id,
          transactionId: transaction.id,
          amount: account.amount,
          currencyId: request.currencyId,
        }))
      )
      .execute();

    // update balance of accounts
    this.entityManager.save(accounts);
  }
}
