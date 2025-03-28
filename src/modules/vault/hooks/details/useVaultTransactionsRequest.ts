import { TransactionType } from 'bakosafe';

import { useBakoSafeTransactionList } from '@/modules/core';
import { SortOptionTx } from '@/modules/core/hooks/bakosafe/utils/types';
import { TransactionOrderBy } from '@/modules/transactions/services';
import { DEFAULT_INITIAL_PAGE_PARAM } from '@/utils/constants';

const VAULT_TRANSACTIONS_QUERY_KEY = 'transactions/byVault';

const useVaultTransactionsRequest = (
  vaultId: string,
  type?: TransactionType,
) => {
  const { data, ...query } = useBakoSafeTransactionList({
    vaultId,
    filter: {
      orderBy: TransactionOrderBy.CREATED_AT,
      sort: SortOptionTx.DESC,
      page: DEFAULT_INITIAL_PAGE_PARAM,
      perPage: 5,
      limit: 5,
      type,
    },
  });

  return {
    transactions: data,
    ...query,
  };
};

export { useVaultTransactionsRequest, VAULT_TRANSACTIONS_QUERY_KEY };
