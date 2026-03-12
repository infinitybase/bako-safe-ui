import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useListMeldProviders = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/providers'],
    queryFn: () => VaultService.getServiceProviders(),
    // Providers list is immutable - never needs refetch
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    providers: data ?? [],
    ...rest,
  };
};
