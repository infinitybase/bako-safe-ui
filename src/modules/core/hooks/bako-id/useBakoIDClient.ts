import { BakoIDClient } from '@bako-id/sdk';
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { BakoProvider } from 'bakosafe';
import { Provider } from 'fuels';
import { useCallback } from 'react';

import { localStorageKeys } from '@/modules/auth';
import { availableNetWorks, NetworkType } from '@/modules/network/services';

const client = new BakoIDClient('http://localhost:3000/api');

const BAKOID_QUERY_KEYS = {
  base: ['bako-id'] as QueryKey,
  name: (name: string) => {
    const base = BAKOID_QUERY_KEYS.base.concat(['name', name]);
    return base as QueryKey;
  },
  address: (address: string) => {
    const base = BAKOID_QUERY_KEYS.base.concat(['address', address]);
    return base as QueryKey;
  },
  names: (addresses: string[]) => {
    const base = BAKOID_QUERY_KEYS.base.concat(['names', ...addresses]);
    return base as QueryKey;
  },
  avatar: (name: string) => {
    const base = BAKOID_QUERY_KEYS.base.concat(['avatar', name]);
    return base as QueryKey;
  },
};

export const useBakoIDResolveNames = (options: {
  addresses: string[];
  provider: Promise<Provider>;
}) => {
  const { addresses, provider: providerInstance } = options;
  return useQuery({
    queryKey: BAKOID_QUERY_KEYS.names(addresses),
    queryFn: async () => {
      const provider = await providerInstance;
      return client.names(addresses, await provider.getChainId());
    },
    enabled: addresses.length > 0,
  });
};

export const useBakoIDClient = (providerInstance: Promise<BakoProvider>) => {
  const queryClient = useQueryClient();
  // const { providerInstance } = useWorkspaceDetails();

  const getResolverAddress = useCallback(
    (name: string) => {
      const queryData = queryClient.getQueryData<string | null>(
        BAKOID_QUERY_KEYS.name(name),
      );
      return queryData;
    },
    [queryClient],
  );

  const getResolverName = useCallback(
    (address: string) => {
      const queryData = queryClient.getQueryData<string | null>(
        BAKOID_QUERY_KEYS.address(address),
      );
      return queryData;
    },
    [queryClient],
  );

  const { mutateAsync: resolveName, isPending: isResolvingName } = useMutation({
    mutationFn: async (address: string) => {
      const queryData = getResolverName(address);

      if (queryData) {
        return queryData;
      }

      const provider = await providerInstance;
      const name = await client.name(address, await provider.getChainId());
      return name ? `@${name}` : name;
    },
    onSuccess: (data, address) => {
      queryClient.setQueryData(BAKOID_QUERY_KEYS.address(address), data);
    },
  });

  const { mutateAsync: resolveAddress, isPending: isResolvingAddress } =
    useMutation({
      mutationFn: async (name: string) => {
        const queryData = getResolverAddress(name);

        if (queryData) {
          return queryData;
        }

        const provider = await providerInstance;
        return client.resolver(name, await provider.getChainId());
      },
      onSuccess: (data, name) => {
        queryClient.setQueryData(BAKOID_QUERY_KEYS.name(name), data);
      },
    });

  return {
    client,
    handlers: {
      getResolverName,
      getResolverAddress,
      fetchResolverName: {
        handler: resolveName,
        isLoading: isResolvingName,
      },
      fetchResolveAddress: {
        handler: resolveAddress,
        isLoading: isResolvingAddress,
      },
    },
  };
};

export const useAvatar = (name: string) => {
  const chainId = Number(
    localStorage.getItem(localStorageKeys.SELECTED_CHAIN_ID) ??
      availableNetWorks[NetworkType.MAINNET].chainId,
  );
  const { data: avatar, ...rest } = useQuery({
    queryFn: () => {
      return client.avatar(name, chainId);
    },
    queryKey: BAKOID_QUERY_KEYS.avatar(name),
  });

  return { avatar, ...rest };
};
