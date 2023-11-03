import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';
import { In } from 'typeorm';

import { serverModule } from '../module.js';
import { CurrencyAccount } from '../entities/index.js';
import { currencyAccountApi } from '../../base/index.js';

@serverModule.injectable()
export class CreateCurrencyAccountService extends InjectDatabaseService {
  async handle(request: {
    userId: string;
    currencyId: string;
    type?: string;
    minBalance?: number;
  }) {
    const currencyAccount = new CurrencyAccount();
    Object.assign(currencyAccount, request);

    await this.entityManager.save(currencyAccount);
    return { id: currencyAccount.id };
  }
}

@serverModule.injectable()
export class GetCurrencyAccountService extends InjectDatabaseService {
  async handle(request: { currencyAccountId: string }) {
    const currencyAccount = await this.entityManager
      .getRepository(CurrencyAccount)
      .findOne({
        where: { id: request.currencyAccountId },
        cache: true,
      });
    if (currencyAccount) {
      return currencyAccount;
    }
    throw new NotFoundException();
  }
}

@serverModule.useApi(currencyAccountApi.getMany)
export class GetCurrencyAccountsApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof currencyAccountApi.getMany>) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(CurrencyAccount)
      .findAndCount({
        where: {
          userId: request.userIds ? In(request.userIds) : request.userId,
          currencyId: request.currencyId,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}
