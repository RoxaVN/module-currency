import {
  ApiSource,
  ExactProps,
  IsOptional,
  Max,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { scopes, permissions } from '../access.js';

const accountTransactionSource = new ApiSource<{
  id: string;
  accountId: string;
  amount: number;
  currencyId: string;
  createdDate: Date;
  transactionId: string;
  transaction: {
    id: string;
    originalTransactionId?: string;
    type: string;
    metadata?: any;
  };
}>([scopes.CurrencyAccount, scopes.Transaction], baseModule);

class GetAccountTransactionsRequest extends ExactProps<GetAccountTransactionsRequest> {
  @MinLength(1)
  public readonly currencyAccountId: string;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;

  @Min(1)
  @Max(100)
  @TransformNumber()
  @IsOptional()
  public readonly pageSize?: number;
}

export const accountTransactionApi = {
  getMany: accountTransactionSource.getMany({
    validator: GetAccountTransactionsRequest,
    permission: permissions.ReadAccountTransactions,
  }),
};
