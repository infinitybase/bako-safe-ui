import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../services';

export const useVaultAllocationRequest = (predicateId: string) => {
  const { data: allocation, ...rest } = useQuery({
    queryKey: ['predicate-allocation', predicateId],
    queryFn: () => VaultService.getBalanceAllocation(predicateId),
    enabled: !!predicateId,
    refetchOnWindowFocus: true,
  });

  return { allocation, ...rest };
};
