import { BadRequestException } from '@roxavn/core/base';
import {
  BaseService,
  InjectDatabaseService,
  inject,
} from '@roxavn/core/server';
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
import { GetOrCreateUserCurrencyAccountsService } from './user.currency.account.js';

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
    Object.assign(transaction, {
      currencyId: request.currencyId,
      type: request.type,
      metadata: request.metadata,
      originalTransactionId: request.originalTransactionId,
    });

    await this.entityManager.getRepository(Transaction).save(transaction);

    accountTransactions.forEach((at) => {
      at.currencyId = request.currencyId;
      at.transactionId = transaction.id;
      at.transaction = transaction;
    });
    await this.entityManager
      .getRepository(AccountTransaction)
      .insert(accountTransactions);

    // update balance of accounts
    await this.entityManager.getRepository(CurrencyAccount).save(accounts);

    return accountTransactions;
  }
}

@serverModule.injectable()
export class CreateBankerTransactionService extends BaseService {
  accounts: { [userId: string]: { [currencyId: string]: string } } = {};

  constructor(
    @inject(GetOrCreateUserCurrencyAccountsService)
    protected getOrCreateUserCurrencyAccountsService: GetOrCreateUserCurrencyAccountsService,
    @inject(CreateTransactionService)
    protected createTransactionService: CreateTransactionService
  ) {
    super();
  }

  /**
   * Auto create banker account and cache its id
   */
  async handle(request: {
    currencyId: string;
    type?: string;
    originalTransactionId?: string;
    metadata?: Record<string, any>;
    account: {
      accountId: string;
      amount: number | bigint;
    };
    bankerUserId: string;
  }) {
    let user = this.accounts[request.bankerUserId];
    if (!user) {
      user = {};
      this.accounts[request.bankerUserId] = user;
    }
    let bankerAccountId = user[request.currencyId];
    if (!bankerAccountId) {
      const { items } =
        await this.getOrCreateUserCurrencyAccountsService.handle({
          userId: request.bankerUserId,
          currencyIds: [request.currencyId],
          minBalance: null,
        });
      bankerAccountId = items[0].id;
      user[request.currencyId] = bankerAccountId;
    }

    const transactions = await this.createTransactionService.handle({
      currencyId: request.currencyId,
      metadata: request.metadata,
      originalTransactionId: request.originalTransactionId,
      type: request.type,
      accounts: [
        request.account,
        {
          accountId: bankerAccountId,
          amount: -request.account.amount,
        },
      ],
    });

    return transactions.find(
      (t) => t.accountId === request.account.accountId
    ) as AccountTransaction;
  }
}
