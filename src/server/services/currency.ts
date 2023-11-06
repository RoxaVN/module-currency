import { NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { Currency } from '../entities/index.js';

@serverModule.injectable()
export class CreateCurrencyService extends InjectDatabaseService {
  async handle(request: { symbol: string; name: string; id?: string }) {
    const currency = new Currency();
    Object.assign(currency, request);

    await this.entityManager.getRepository(Currency).insert(currency);
    return { id: currency.id };
  }
}

@serverModule.injectable()
export class GetCurrencyService extends InjectDatabaseService {
  async handle(request: { currencyId: string }) {
    const currency = await this.entityManager.getRepository(Currency).findOne({
      where: { id: request.currencyId },
      cache: true,
    });
    if (currency) {
      return currency;
    }
    throw new NotFoundException();
  }
}
