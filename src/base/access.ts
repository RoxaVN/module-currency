import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  CurrencyAccount: { name: 'currencyAccount' },
  Transaction: { name: 'transaction' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadAccountTransactions: {
    allowedScopes: [
      accessManager.scopes.ResourceOwner(scopes.CurrencyAccount.name),
    ],
  },
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
