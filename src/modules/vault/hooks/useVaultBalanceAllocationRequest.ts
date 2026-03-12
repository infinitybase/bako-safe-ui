import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../services';

export const vaultAllocationQueryKey = {
  VAULT_ALLOCATION_QUERY_KEY: (predicateId: string) => [
    'predicate-allocation',
    predicateId,
  ],
};

export const useVaultAllocationRequest = (predicateId: string) => {
  const { data: allocation, ...rest } = useQuery({
    queryKey: vaultAllocationQueryKey.VAULT_ALLOCATION_QUERY_KEY(predicateId),
    queryFn: () => VaultService.getBalanceAllocation(predicateId),
    enabled: !!predicateId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes - socket events handle real-time updates
  });

  return { allocation, ...rest };
};
