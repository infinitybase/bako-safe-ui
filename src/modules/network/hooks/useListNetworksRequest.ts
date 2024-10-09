import { useQuery } from '@tanstack/react-query';

import { NetworkQueryKey, NetworkService } from '../services';

const useListNetworksRequest = () => {
  return useQuery({
    queryKey: [NetworkQueryKey.LIST_NETWORKS],
    queryFn: async () => NetworkService.list(),
  });
};

export { useListNetworksRequest };
