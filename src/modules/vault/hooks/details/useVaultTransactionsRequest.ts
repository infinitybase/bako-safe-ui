import { Vault } from 'bakosafe';

import { useBsafeTransactionList } from '@/modules/core';
import { SortOption } from '@/modules/transactions/services';

const VAULT_TRANSACTIONS_QUERY_KEY = 'transactions/byVault';

const useVaultTransactionsRequest = (vault: Vault) => {
  const { data, ...query } = useBsafeTransactionList({
    vault,
    filter: {
      orderBy: 'createdAt',
      sort: SortOption.DESC,
      limit: 6,
    },
  });

  return {
    transactions: data,
    ...query,
  };
};

export { useVaultTransactionsRequest, VAULT_TRANSACTIONS_QUERY_KEY };
