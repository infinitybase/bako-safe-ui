import {
  GetAllPredicatesPayload,
  VaultService,
} from '@bako-safe/services/modules/vault';
import { useInfiniteQuery } from '@tanstack/react-query';

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
        page: pageParam || 0,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage !== lastPage.totalPages
        ? lastPage.nextPage
        : undefined,
    refetchOnWindowFocus: false,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500,
  });

  return {
    vaults: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useUserVaultRequest };
