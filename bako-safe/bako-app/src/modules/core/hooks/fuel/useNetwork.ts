import { useQuery } from '@tanstack/react-query';
import { Provider } from 'fuels';

import { FuelChainInfo, FuelQueryKeys } from '@/modules/core/hooks/fuel/types';

export class CachedNetwork {
  static getNetworks = () => {
    return JSON.parse(
      localStorage.getItem(FuelQueryKeys.CACHED_NETWORKS) || '[]',
    ) as FuelChainInfo[];
  };

  static getNetwork = (url: string) => {
    const networks = CachedNetwork.getNetworks();
    return networks.find((n) => n.url === url);
  };

  static storeNetwork = (chain: FuelChainInfo) => {
    const networks = CachedNetwork.getNetworks();
    const hasNetwork = networks.some((n) => n.url === chain.url);
    if (!hasNetwork) {
      networks.push(chain);
      localStorage.setItem(
        FuelQueryKeys.CACHED_NETWORKS,
        JSON.stringify(networks),
      );
    }
  };
}

export const useNetworkInfo = (url?: string) => {
  const { data, ...rest } = useQuery({
    queryKey: [FuelQueryKeys.CACHED_NETWORKS, url],
    queryFn: async () => {
      const network = CachedNetwork.getNetwork(url!);
      if (network) return network;

      const provider = await Provider.create(url!);
      const info = provider.getChain();
      const networkInfo = { ...info, url: provider.url };
      CachedNetwork.storeNetwork(networkInfo);
      return networkInfo;
    },
    enabled: !!url,
  });

  return {
    network: data,
    ...rest,
  };
};
