import { ApiSource, MinLength, PaginationRequest } from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { scopes, permissions } from '../access.js';

export interface AccountTransactionResponse {
  id: string;
  accountId: string;
  amount: string;
  currencyId: string;
  oldBalance: string;
  newBalance: string;
  createdDate: Date;
  transactionId: string;
  transaction: {
    id: string;
    originalTransactionId?: string;
    type: string;
    metadata?: any;
  };
}

const accountTransactionSource = new ApiSource<AccountTransactionResponse>(
  [scopes.CurrencyAccount, scopes.Transaction],
  baseModule
);

class GetAccountTransactionsRequest extends PaginationRequest<GetAccountTransactionsRequest> {
  @MinLength(1)
  public readonly currencyAccountId: string;
}

export const accountTransactionApi = {
  getMany: accountTransactionSource.getMany({
    validator: GetAccountTransactionsRequest,
    permission: permissions.ReadAccountTransactions,
  }),
};
