import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { DEFAULT_INITIAL_PAGE_PARAM } from '@/utils/constants';

import { GetAllPredicatesPayload, VaultService } from '../services';

const USER_VAULTS_QUERY_KEY = 'predicate/by-user-address';

const useUserVaultRequest = (
  userAddress: string,
  filter: GetAllPredicatesPayload,
) => {
  const { data, ...query } = useInfiniteQuery({
    queryKey: [USER_VAULTS_QUERY_KEY, userAddress, filter],
    queryFn: ({ pageParam }) =>
      VaultService.getAllWithPagination({
        ...filter,
        perPage: filter.perPage || 8,
        page: pageParam || DEFAULT_INITIAL_PAGE_PARAM,
      }),
    initialPageParam: DEFAULT_INITIAL_PAGE_PARAM,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage !== lastPage.totalPages
        ? lastPage.nextPage
        : undefined,
    refetchOnWindowFocus: false,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500,
  });

  const vaults = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        page.data.map((vault) => ({
          ...vault,
          configurable:
            typeof vault.configurable === 'string'
              ? JSON.parse(vault.configurable)
              : vault.configurable,
        })),
      ) ?? [],
    [data],
  );

  return {
    vaults,
    ...query,
  };
};

export { useUserVaultRequest };
