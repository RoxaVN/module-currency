import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  CurrencyAccount: { name: 'currencyAccount' },
  Transaction: { name: 'transaction' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadUserCurrencyAccounts: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  ReadCurrencyAccounts: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  ReadAccountTransactions: {
    allowedScopes: [
      accessManager.scopes.ResourceOwner(scopes.CurrencyAccount.name),
    ],
  },
  CreateTransaction: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
