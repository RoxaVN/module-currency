import {
  ApiSource,
  ExactProps,
  IsOptional,
  Max,
  Min,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

export interface CurrencyAccountResponse {}

const currencyAccountSource = new ApiSource<CurrencyAccountResponse>(
  [scopes.CurrencyAccount],
  baseModule
);

export class GetCurrencyAccountsRequest extends ExactProps<GetCurrencyAccountsRequest> {
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
