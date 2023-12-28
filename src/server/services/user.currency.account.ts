import { InferApiRequest } from '@roxavn/core/base';
import {
  BaseService,
  InjectDatabaseService,
  inject,
} from '@roxavn/core/server';
import { groupBy } from 'lodash-es';
import { Brackets, In } from 'typeorm';

import { userCurrencyAccountApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { CurrencyAccount } from '../entities/index.js';

@serverModule.injectable()
export class GetOrCreateUserCurrencyAccountsService extends InjectDatabaseService {
  async handle(request: {
    userId: string;
    currencyIds: string[];
    minBalance: number | null | bigint;
  }) {
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
        account.minBalance = request.minBalance as any;
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

@serverModule.useApi(userCurrencyAccountApi.getOrCreateMany)
export class GetOrCreateUserCurrencyAccountsApiService extends BaseService {
  constructor(
    @inject(GetOrCreateUserCurrencyAccountsService)
    protected getOrCreateUserCurrencyAccountsService: GetOrCreateUserCurrencyAccountsService
  ) {
    super();
  }

  handle(
    request: InferApiRequest<typeof userCurrencyAccountApi.getOrCreateMany>
  ) {
    return this.getOrCreateUserCurrencyAccountsService.handle({
      ...request,
      minBalance: 0,
    });
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
    const typeGroup = groupBy(
      request.accounts,
      (item) => item.type || CurrencyAccount.TYPE_DEFAULT
    );

    const items = await this.entityManager
      .getRepository(CurrencyAccount)
      .createQueryBuilder('currencyAccount')
      .where('currencyAccount.currencyId = :currencyId', {
        currencyId: request.currencyId,
      })
      .andWhere(
        new Brackets((qb) => {
          Object.entries(typeGroup).map(([type, accounts], index) => {
            qb.orWhere(
              new Brackets((qb1) => {
                qb1
                  .where(`currencyAccount.userId IN (:...userIds${index})`, {
                    [`userIds${index}`]: accounts.map((acc) => acc.userId),
                  })
                  .andWhere(`currencyAccount.type = :type${index}`, {
                    [`type${index}`]: type,
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
