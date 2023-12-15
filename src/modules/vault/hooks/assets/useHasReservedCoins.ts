import { useQuery } from 'react-query';

import { VaultService } from '@/modules';

export const useHasReservedCoins = (address: string) => {
  return useQuery(
    ['predicate/has-reserved-coins', address],
    () => VaultService.hasReservedCoins(address),
    {
      refetchOnWindowFocus: false,
      enabled: !!address,
    },
  );
};
