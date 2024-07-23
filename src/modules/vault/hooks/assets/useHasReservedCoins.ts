import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useHasReservedCoins = (address: string) => {
  return useQuery({
    queryKey: ['predicate/has-reserved-coins', address],
    queryFn: () => VaultService.hasReservedCoins(address),
    refetchOnWindowFocus: false,
    enabled: !!address,
  });
};
