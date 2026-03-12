import { useQuery } from '@tanstack/react-query';

import { NetworkQueryKey, NetworkService } from '../services';

const useListNetworksRequest = () => {
  return useQuery({
    queryKey: [NetworkQueryKey.LIST_NETWORKS],
    queryFn: async () => NetworkService.list(),
    // Networks are immutable - never needs refetch
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export { useListNetworksRequest };
