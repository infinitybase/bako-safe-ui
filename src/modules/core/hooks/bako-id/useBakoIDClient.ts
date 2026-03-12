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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { queryClient } from '@/config/query-client';
import { localStorageKeys } from '@/modules/auth/services';

const client = new BakoIDClient();

// Zustand store for persistent Bako ID cache
type BakoIDCacheStore = {
  // address -> name mapping
  addressToName: Record<string, string | null>;
  // name -> address mapping
  nameToAddress: Record<string, string | null>;
  // avatar URLs: name -> avatar url
  avatars: Record<string, string | null>;
  // Batch names resolution: sorted addresses key -> results
  batchNames: Record<string, Array<{ name: string; resolver: string }>>;
  // Setters
  setAddressToName: (address: string, name: string | null) => void;
  setNameToAddress: (name: string, address: string | null) => void;
  setAvatar: (name: string, avatar: string | null) => void;
  setBatchNames: (
    addresses: string[],
    results: Array<{ name: string; resolver: string }>,
  ) => void;
  // Getters
  getNameByAddress: (address: string) => string | null | undefined;
  getAddressByName: (name: string) => string | null | undefined;
  getAvatar: (name: string) => string | null | undefined;
  getBatchNames: (
    addresses: string[],
  ) => Array<{ name: string; resolver: string }> | undefined;
  // Clear
  clearAll: () => void;
  clearAddress: (address: string) => void;
  clearName: (name: string) => void;
  clearAvatar: (name: string) => void;
};

const createBatchKey = (addresses: string[]) => [...addresses].sort().join(',');

export const useBakoIDCacheStore = create(
  persist<BakoIDCacheStore>(
    (set, get) => ({
      addressToName: {},
      nameToAddress: {},
      avatars: {},
      batchNames: {},

      setAddressToName: (address, name) =>
        set((state) => ({
          addressToName: { ...state.addressToName, [address]: name },
        })),

      setNameToAddress: (name, address) =>
        set((state) => ({
          nameToAddress: { ...state.nameToAddress, [name]: address },
        })),

      setAvatar: (name, avatar) =>
        set((state) => ({
          avatars: { ...state.avatars, [name]: avatar },
        })),

      setBatchNames: (addresses, results) => {
        const key = createBatchKey(addresses);
        set((state) => ({
          batchNames: { ...state.batchNames, [key]: results },
        }));
      },

      getNameByAddress: (address) => get().addressToName[address],
      getAddressByName: (name) => get().nameToAddress[name],
      getAvatar: (name) => get().avatars[name],
      getBatchNames: (addresses) => {
        const key = createBatchKey(addresses);
        return get().batchNames[key];
      },

      clearAll: () =>
        set({ addressToName: {}, nameToAddress: {}, avatars: {}, batchNames: {} }),

      clearAddress: (address) =>
        set((state) => {
          const { [address]: _, ...rest } = state.addressToName;
          return { addressToName: rest };
        }),

      clearName: (name) =>
        set((state) => {
          const { [name]: _, ...restNames } = state.nameToAddress;
          const { [name]: __, ...restAvatars } = state.avatars;
          return { nameToAddress: restNames, avatars: restAvatars };
        }),

      clearAvatar: (name) =>
        set((state) => {
          const { [name]: _, ...rest } = state.avatars;
          return { avatars: rest };
        }),
    }),
    {
      name: localStorageKeys.BAKO_ID_CACHE,
      version: 1,
      migrate: (persistedState, version) => {
        if (version < 1) {
          return {
            ...(persistedState as BakoIDCacheStore),
            addressToName: {},
            nameToAddress: {},
            avatars: {},
            batchNames: {},
          };
        }
        return persistedState as BakoIDCacheStore;
      },
    },
  ),
);

// Cache configuration for React Query - use Zustand as source of truth
const BAKO_ID_CACHE_CONFIG = {
  staleTime: Number.POSITIVE_INFINITY,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
} as const;

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
    const sortedAddresses = [...addresses].sort();
    const base = BAKOID_QUERY_KEYS.base.concat(['names', ...sortedAddresses]);
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
  const cache = useBakoIDCacheStore();

  // Get cached data to use as initialData - prevents unnecessary API calls
  const cachedData = cache.getBatchNames(addresses);

  return useQuery({
    queryKey: BAKOID_QUERY_KEYS.names(addresses),
    queryFn: async () => {
      const provider = await providerInstance;
      const results = await client.names(addresses, await provider.getChainId());

      // Store in persistent cache
      cache.setBatchNames(addresses, results);

      return results;
    },
    enabled: addresses.length > 0 && !cachedData,
    initialData: cachedData,
    ...BAKO_ID_CACHE_CONFIG,
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
  const cache = useBakoIDCacheStore();

  // Get cached data - prevents unnecessary API calls
  const cachedData = cache.getNameByAddress(address);
  const hasCachedData = cachedData !== undefined;

  const { data, ...rest } = useQuery({
    queryKey: BAKOID_QUERY_KEYS.address(address),
    queryFn: async () => {
      const provider = await providerInstance;
      const nameResolved = await client.name(
        address,
        await provider.getChainId(),
      );

      // Store in persistent cache
      cache.setAddressToName(address, nameResolved);

      return nameResolved;
    },
    enabled: !hasCachedData && (options.enabled ?? true),
    initialData: cachedData ?? undefined,
    ...BAKO_ID_CACHE_CONFIG,
    ...options,
  });

  return { name: data ?? cachedData, ...rest };
};

export const useResolverAddressQuery = (
  {
    name,
    providerInstance,
  }: { name: string; providerInstance: Promise<Provider> },
  options: QueryOptions = {},
) => {
  const cache = useBakoIDCacheStore();

  // Get cached data - prevents unnecessary API calls
  const cachedData = cache.getAddressByName(name);
  const hasCachedData = cachedData !== undefined;

  const { data, ...rest } = useQuery({
    queryKey: BAKOID_QUERY_KEYS.name(name),
    queryFn: async () => {
      const provider = await providerInstance;
      const addressResolved = await client.resolver(
        name,
        await provider.getChainId(),
      );

      // Store in persistent cache
      cache.setNameToAddress(name, addressResolved);

      return addressResolved;
    },
    enabled: !hasCachedData && (options.enabled ?? true),
    initialData: cachedData ?? undefined,
    ...BAKO_ID_CACHE_CONFIG,
    ...options,
  });

  return { address: data ?? cachedData, ...rest };
};

export const useBakoIDClient = (providerInstance: Promise<BakoProvider>) => {
  const queryClient = useQueryClient();
  const cache = useBakoIDCacheStore();

  const getResolverAddress = useCallback(
    (name: string) => {
      // Check Zustand cache first (persistent)
      const zustandCache = cache.getAddressByName(name);
      if (zustandCache !== undefined) {
        return zustandCache;
      }
      // Fall back to React Query cache (in-memory)
      const queryData = queryClient.getQueryData<string | null>(
        BAKOID_QUERY_KEYS.name(name),
      );
      return queryData;
    },
    [queryClient, cache],
  );

  const getResolverName = useCallback(
    (address: string) => {
      // Check Zustand cache first (persistent)
      const zustandCache = cache.getNameByAddress(address);
      if (zustandCache !== undefined) {
        return zustandCache;
      }
      // Fall back to React Query cache (in-memory)
      const queryData = queryClient.getQueryData<string | null>(
        BAKOID_QUERY_KEYS.address(address),
      );
      return queryData;
    },
    [queryClient, cache],
  );

  const { mutateAsync: resolveName, isPending: isResolvingName } = useMutation({
    mutationFn: async (address: string) => {
      const queryData = getResolverName(address);

      if (queryData) {
        return queryData;
      }

      const provider = await providerInstance;
      const name = await client.name(address, await provider.getChainId());
      const formattedName = name ? `@${name}` : name;

      // Store in persistent cache
      cache.setAddressToName(address, formattedName);

      return formattedName;
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
        const address = await client.resolver(name, await provider.getChainId());

        // Store in persistent cache
        cache.setNameToAddress(name, address);

        return address;
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
  const cache = useBakoIDCacheStore();

  // Get cached data - prevents unnecessary API calls
  const cachedData = cache.getAvatar(name);
  const hasCachedData = cachedData !== undefined;

  const { data: avatar, ...rest } = useQuery({
    queryFn: async () => {
      const avatarUrl = await client.avatar(name, chainId);

      // Store in persistent cache
      cache.setAvatar(name, avatarUrl);

      return avatarUrl;
    },
    queryKey: [...BAKOID_QUERY_KEYS.avatar(name), chainId],
    enabled: !!name && !hasCachedData,
    initialData: cachedData ?? undefined,
    ...BAKO_ID_CACHE_CONFIG,
  });

  return { avatar: avatar ?? cachedData, ...rest };
};

// Manual invalidation functions for Bako ID cache
export const invalidateBakoIDCache = {
  /**
   * Invalidate all Bako ID cached data (both Zustand and React Query)
   */
  all: () => {
    useBakoIDCacheStore.getState().clearAll();
    queryClient.invalidateQueries({ queryKey: BAKOID_QUERY_KEYS.base });
  },
  /**
   * Invalidate cache for a specific address (name resolution)
   */
  address: (address: string) => {
    useBakoIDCacheStore.getState().clearAddress(address);
    queryClient.invalidateQueries({
      queryKey: BAKOID_QUERY_KEYS.address(address),
    });
  },
  /**
   * Invalidate cache for a specific name (address resolution)
   */
  name: (name: string) => {
    useBakoIDCacheStore.getState().clearName(name);
    queryClient.invalidateQueries({ queryKey: BAKOID_QUERY_KEYS.name(name) });
  },
  /**
   * Invalidate avatar cache for a specific name
   */
  avatar: (name: string) => {
    useBakoIDCacheStore.getState().clearAvatar(name);
    queryClient.invalidateQueries({ queryKey: BAKOID_QUERY_KEYS.avatar(name) });
  },
  /**
   * Invalidate cache for multiple addresses
   */
  addresses: (addresses: string[]) => {
    const cache = useBakoIDCacheStore.getState();
    addresses.forEach((address) => {
      cache.clearAddress(address);
      queryClient.invalidateQueries({
        queryKey: BAKOID_QUERY_KEYS.address(address),
      });
    });
    queryClient.invalidateQueries({
      queryKey: BAKOID_QUERY_KEYS.names(addresses),
    });
  },
};
