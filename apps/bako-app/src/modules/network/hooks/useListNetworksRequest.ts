import { NetworkQueryKey } from '@bako-safe/services';
import { useQuery } from '@tanstack/react-query';

import { networkService } from '@/config/services-initializer';

const useListNetworksRequest = () => {
  return useQuery({
    queryKey: [NetworkQueryKey.LIST_NETWORKS],
    queryFn: async () => networkService.list(),
  });
};

export { useListNetworksRequest };
