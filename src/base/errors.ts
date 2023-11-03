import {
  BadRequestException,
  I18nErrorField,
  NotFoundException,
} from '@roxavn/core/base';

import { baseModule } from './module.js';

export class InvalidTotalTransactionAmountException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.InvalidTotalTransactionAmountException',
      ns: baseModule.escapedName,
    },
  };
}

export class AccountNotFoundException extends NotFoundException {
  i18n = {
    default: {
      key: 'Error.AccountNotFoundException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(userId: string, type: string) {
    super();
    this.i18n.default.params = { userId, type };
  }
}

export class InsufficientBalanceException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.InsufficientBalanceException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(userId: string, type: string) {
    super();
    this.i18n.default.params = { userId, type };
  }
}

export class ExceedBalanceException extends InsufficientBalanceException {
  i18n = {
    default: {
      key: 'Error.ExceedBalanceException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };
}
