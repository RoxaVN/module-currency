import { ApiTable, utils, webModule as coreWebModule } from '@roxavn/core/web';

import { accountTransactionApi } from '../../base/index.js';
import { webModule } from '../module.js';

export interface AccountTransactionsProps {
  currencyAccountId: string;
}

export const AccountTransactions = ({
  currencyAccountId,
}: AccountTransactionsProps) => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;

  return (
    <ApiTable
      api={accountTransactionApi.getMany}
      apiParams={{ currencyAccountId }}
      columns={{
        amount: {
          label: t('amount'),
          render: utils.Render.number,
        },
        oldBalance: {
          label: t('oldBalance'),
          render: utils.Render.number,
        },
        newBalance: {
          label: t('newBalance'),
          render: utils.Render.number,
        },
        transaction: {
          label: tCore('type'),
          render: (value) => value.type,
        },
        createdDate: {
          label: tCore('createdDate'),
          render: utils.Render.datetime,
        },
      }}
    ></ApiTable>
  );
};
