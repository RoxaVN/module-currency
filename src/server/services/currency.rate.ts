import { NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { CurrencyRate } from '../entities/index.js';

@serverModule.injectable()
export class CreateCurrencyRateService extends InjectDatabaseService {
  async handle(request: {
    currency1: string;
    currency2: string;
    rate: number;
    type?: string;
  }) {
    const currencyRate = new CurrencyRate();
    Object.assign(currencyRate, request);

    await this.entityManager.save(currencyRate);
    return { id: currencyRate.id };
  }
}

@serverModule.injectable()
export class GetLastCurrencyRateService extends InjectDatabaseService {
  async handle(request: {
    currency1: string;
    currency2: string;
    type?: string;
  }) {
    const currencyRate = await this.entityManager
      .getRepository(CurrencyRate)
      .findOne({
        where: {
          currency1: request.currency1,
          currency2: request.currency2,
          type: request.type || CurrencyRate.TYPE_DEFAULT,
        },
        order: { id: 'DESC' },
      });
    if (currencyRate) {
      return { rate: currencyRate.rate, createdDate: currencyRate.createdDate };
    }
    throw new NotFoundException();
  }
}
