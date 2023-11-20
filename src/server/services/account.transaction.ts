import { InferApiRequest } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { accountTransactionApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { AccountTransaction } from '../entities/index.js';

@serverModule.useApi(accountTransactionApi.getMany)
export class GetAccountTransactionsApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof accountTransactionApi.getMany>) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(AccountTransaction)
      .findAndCount({
        relations: { transaction: true },
        where: {
          accountId: request.currencyAccountId,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
        order: { transactionId: 'DESC' },
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}
