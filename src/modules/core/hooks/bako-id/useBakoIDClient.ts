import { BakoIDClient } from '@bako-id/sdk';
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { BakoProvider } from 'bakosafe';
import { Provider } from 'fuels';
import { useCallback } from 'react';

const client = new BakoIDClient();

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

type QueryOptions = Omit<
  UseQueryOptions<string | null>,
  'queryKey' | 'queryFn'
>;

export const useResolverNameQuery = (
  {
    address,
    providerInstance,
  }: { address: string; providerInstance: Promise<Provider> },
  options: QueryOptions = {},
) => {
  const { data, ...rest } = useQuery({
    queryKey: BAKOID_QUERY_KEYS.address(address),
    queryFn: async () => {
      const provider = await providerInstance;
      const nameResolved = await client.name(
        address,
        await provider.getChainId(),
      );
      return nameResolved;
    },
    ...options,
  });

  return { name: data, ...rest };
};

export const useResolverAddressQuery = (
  {
    name,
    providerInstance,
  }: { name: string; providerInstance: Promise<Provider> },
  options: QueryOptions = {},
) => {
  const { data, ...rest } = useQuery({
    queryKey: BAKOID_QUERY_KEYS.name(name),
    queryFn: async () => {
      const provider = await providerInstance;
      const addressResolved = await client.resolver(
        name,
        await provider.getChainId(),
      );
      return addressResolved;
    },
    ...options,
  });

  return { address: data, ...rest };
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

export const useBakoIdAvatar = (name: string, chainId: number) => {
  const { data: avatar, ...rest } = useQuery({
    queryFn: () => {
      return client.avatar(name, chainId);
    },
    queryKey: [...BAKOID_QUERY_KEYS.avatar(name), chainId],
    enabled: !!name,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { avatar, ...rest };
};
