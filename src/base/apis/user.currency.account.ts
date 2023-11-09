import {
  ApiSource,
  ArrayMaxSize,
  ArrayMinSize,
  ExactProps,
  MinLength,
  accessManager,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';
import { CurrencyAccountResponse } from './currency.account.js';

const userCurrencyAccountSource = new ApiSource<CurrencyAccountResponse>(
  [accessManager.scopes.User, scopes.CurrencyAccount],
  baseModule
);

export class GetOrCreateUserCurrencyAccountsRequest extends ExactProps<GetOrCreateUserCurrencyAccountsRequest> {
  @MinLength(1)
  public readonly userId: string;

  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  public readonly currencyIds: string[];
}

export const userCurrencyAccountApi = {
  getOrCreateMany: userCurrencyAccountSource.getAll({
    method: 'POST',
    validator: GetOrCreateUserCurrencyAccountsRequest,
    permission: permissions.ReadUserCurrencyAccounts,
  }),
};
