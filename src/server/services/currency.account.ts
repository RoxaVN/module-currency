import { NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { CurrencyAccount } from '../entities/index.js';

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

@serverModule.injectable()
export class GetAllCurrencyAccountsService extends InjectDatabaseService {
  async handle(request: { userId?: string; currencyId: string }) {
    return this.entityManager.getRepository(CurrencyAccount).find({
      where: {
        userId: request.userId,
        currencyId: request.currencyId,
      },
    });
  }
}
