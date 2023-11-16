import { BadRequestException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';
import { sum, uniqWith } from 'lodash-es';
import { In } from 'typeorm';

import { serverModule } from '../module.js';
import {
  AccountTransaction,
  CurrencyAccount,
  Transaction,
} from '../entities/index.js';
import {
  AccountNotFoundException,
  ExceedBalanceException,
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
      accountId: string;
      amount: number | bigint;
    }>;
  }) {
    const total = sum(request.accounts.map((acc) => acc.amount));
    // convert bigint to string
    if (total.toString() !== '0') {
      throw new InvalidTotalTransactionAmountException();
    }

    // check for duplicate accounts
    if (
      uniqWith(request.accounts, (a, b) => a.accountId === b.accountId)
        .length !== request.accounts.length
    ) {
      throw new BadRequestException();
    }

    const accounts = await this.entityManager
      .getRepository(CurrencyAccount)
      .find({
        lock: { mode: 'pessimistic_write' },
        where: {
          id: In(request.accounts.map((a) => a.accountId)),
        },
      });

    const accountTransactions: Array<AccountTransaction> = [];

    for (const requestAccount of request.accounts) {
      const account = accounts.find((a) => a.id === requestAccount.accountId);
      if (account) {
        const accountTransaction = new AccountTransaction();
        accountTransaction.oldBalance = account.balance;
        account.balance = (
          BigInt(account.balance) + BigInt(requestAccount.amount)
        ).toString();
        if (account.minBalance && account.balance < account.minBalance) {
          throw new InsufficientBalanceException(account.userId, account.type);
        }
        if (account.maxBalance && account.balance > account.maxBalance) {
          throw new ExceedBalanceException(account.userId, account.type);
        }
        accountTransaction.accountId = account.id;
        accountTransaction.newBalance = account.balance;
        accountTransaction.amount = requestAccount.amount.toString();
        accountTransactions.push(accountTransaction);
      } else {
        throw new AccountNotFoundException(requestAccount.accountId);
      }
    }
    const transaction = new Transaction();
    Object.assign(transaction, request);

    await this.entityManager.getRepository(Transaction).save(transaction);

    accountTransactions.forEach((at) => {
      at.currencyId = request.currencyId;
      at.transactionId = transaction.id;
    });
    await this.entityManager
      .getRepository(AccountTransaction)
      .insert(accountTransactions);

    // update balance of accounts
    await this.entityManager.getRepository(CurrencyAccount).save(accounts);

    return accountTransactions;
  }
}
