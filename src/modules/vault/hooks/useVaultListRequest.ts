import { useInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_INITIAL_PAGE_PARAM } from '@/utils/constants';

import { GetAllPredicatesPayload, VaultService } from '../services';

const useVaultListRequest = (
  filter: GetAllPredicatesPayload,
  enabled?: boolean,
) => {
  const { data, ...query } = useInfiniteQuery({
    queryKey: ['vault/pagination', filter],
    queryFn: ({ pageParam }) =>
      VaultService.getAllWithPagination({
        ...filter,
        perPage: filter.perPage || 5,
        page: pageParam || DEFAULT_INITIAL_PAGE_PARAM,
      }),
    initialPageParam: DEFAULT_INITIAL_PAGE_PARAM,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes - socket events handle real-time updates
    getNextPageParam: (lastPage) =>
      lastPage.currentPage !== lastPage.totalPages
        ? lastPage.nextPage
        : undefined,
    enabled,
  });

  return {
    vaults: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useVaultListRequest };
