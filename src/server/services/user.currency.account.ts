import { InferApiRequest } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';
import { In } from 'typeorm';

import { userCurrencyAccountApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { CurrencyAccount } from '../entities/index.js';

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
