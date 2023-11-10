import {
  ApiSource,
  ExactProps,
  IsOptional,
  Max,
  Min,
  MinLength,
  TransformArray,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

export interface CurrencyAccountResponse {
  id: string;
  userId: string;
  currencyId: string;
  type: string;
  balance: string;
  minBalance?: string;
  maxBalance?: string;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
}

const currencyAccountSource = new ApiSource<CurrencyAccountResponse>(
  [scopes.CurrencyAccount],
  baseModule
);

export class GetCurrencyAccountsRequest extends ExactProps<GetCurrencyAccountsRequest> {
  @MinLength(1)
  @IsOptional()
  public readonly userId?: string;

  @TransformArray()
  @IsOptional()
  public readonly userIds?: string[];

  @MinLength(1)
  @IsOptional()
  public readonly currencyId?: string;

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

export const currencyAccountApi = {
  getMany: currencyAccountSource.getMany({
    validator: GetCurrencyAccountsRequest,
    permission: permissions.ReadCurrencyAccounts,
  }),
};
