import { SortOptionTx, TransactionType } from 'bakosafe';

import { useBakoSafeTransactionList } from '@/modules/core';
import { TransactionOrderBy } from '@/modules/transactions/services';

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
      page: 0,
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
