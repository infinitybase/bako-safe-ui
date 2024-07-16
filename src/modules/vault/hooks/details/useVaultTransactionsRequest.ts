import { SortOptionTx, Vault } from 'bakosafe';

import { useBakoSafeTransactionList } from '@/modules/core';
import { TransactionType } from 'bakosafe';

const VAULT_TRANSACTIONS_QUERY_KEY = 'transactions/byVault';

const useVaultTransactionsRequest = (
  vault: Vault,
  byMonth?: boolean,
  type?: TransactionType,
) => {
  const { data, ...query } = useBakoSafeTransactionList({
    vault,
    filter: {
      orderBy: 'createdAt',
      sort: SortOptionTx.DESC,
      page: 0,
      perPage: 5,
      limit: 5,
      byMonth,
      type,
    },
  });

  return {
    transactions: data,
    ...query,
  };
};

export { useVaultTransactionsRequest, VAULT_TRANSACTIONS_QUERY_KEY };
