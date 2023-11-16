import { InferApiRequest } from '@roxavn/core/base';
import {
  BaseService,
  InjectDatabaseService,
  inject,
} from '@roxavn/core/server';
import {
  CreateUserApiService,
  GetUsersApiService,
} from '@roxavn/module-user/server';
import { Brackets, In } from 'typeorm';

import { userCurrencyAccountApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { CurrencyAccount } from '../entities/index.js';
import { CreateCurrencyAccountService } from './currency.account.js';

@serverModule.useApi(userCurrencyAccountApi.getOrCreateMany)
export class GetOrCreateUserCurrencyAccountsApiService extends InjectDatabaseService {
  async handle(
    request: InferApiRequest<typeof userCurrencyAccountApi.getOrCreateMany>
  ) {
    const items = await this.entityManager.getRepository(CurrencyAccount).find({
      where: {
        userId: request.userId,
        currencyId: In(request.currencyIds),
      },
    });

    const newAccounts: Array<CurrencyAccount> = [];
    for (const currencyId of request.currencyIds) {
      if (!items.find((item) => item.currencyId === currencyId)) {
        const account = new CurrencyAccount();
        account.userId = request.userId;
        account.currencyId = currencyId;
        account.minBalance = '0';
        newAccounts.push(account);
      }
    }
    if (newAccounts.length) {
      await this.entityManager
        .getRepository(CurrencyAccount)
        .insert(newAccounts);
      items.push(...newAccounts);
    }

    return { items };
  }
}

@serverModule.injectable()
export class CreateUserAndCurrencyAccountsService extends BaseService {
  constructor(
    @inject(CreateUserApiService)
    public createUserApiService: CreateUserApiService,
    @inject(GetUsersApiService)
    public getUsersApiService: GetUsersApiService,
    @inject(CreateCurrencyAccountService)
    public createCurrencyAccountService: CreateCurrencyAccountService
  ) {
    super();
  }

  async handle(request: {
    username: string;
    currencyIds: string[];
    minBalance?: number;
  }) {
    const { items } = await this.getUsersApiService.handle({
      username: request.username,
    });
    if (!items.length) {
      const user = await this.createUserApiService.handle({
        username: request.username,
      });
      await Promise.all(
        request.currencyIds.map((CurrencyId) =>
          this.createCurrencyAccountService.handle({
            userId: user.id,
            currencyId: CurrencyId,
            minBalance: request.minBalance || null,
          })
        )
      );
    }
  }
}

@serverModule.injectable()
export class GetUserCurrencyAccountsService extends InjectDatabaseService {
  async handle(request: {
    currencyId: string;
    accounts: Array<{
      userId: string;
      type?: string;
    }>;
  }) {
    const items = await this.entityManager
      .getRepository(CurrencyAccount)
      .createQueryBuilder('currencyAccount')
      .where('currencyAccount.currencyId = :currencyId', {
        currencyId: request.currencyId,
      })
      .andWhere(
        new Brackets((qb) => {
          request.accounts.map((account) => {
            qb.orWhere(
              new Brackets((qb1) => {
                qb1
                  .where('currencyAccount.userId = :userId', {
                    userId: account.userId,
                  })
                  .andWhere('currencyAccount.type = :type', {
                    type: account.type || CurrencyAccount.TYPE_DEFAULT,
                  });
              })
            );
          });
        })
      )
      .getMany();

    return { items };
  }
}
