import type { GetAllPredicatesPayload } from '@bako-safe/services';
import { useInfiniteQuery } from '@tanstack/react-query';

import { vaultService } from '@/config/services-initializer';

const useVaultListRequest = (
  filter: GetAllPredicatesPayload,
  enabled?: boolean,
) => {
  const { data, ...query } = useInfiniteQuery({
    queryKey: ['vault/pagination', filter],
    queryFn: ({ pageParam }) =>
      vaultService.getAllWithPagination({
        ...filter,
        perPage: filter.perPage || 5,
        page: pageParam || 0,
      }),
    initialPageParam: 0,
    refetchOnWindowFocus: true,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage !== lastPage.totalPages
        ? lastPage.nextPage
        : undefined,
    enabled,
  });

  return {
    vaults: data?.pages.flatMap((page) => page.data) ?? [],
    ...query,
  };
};

export { useVaultListRequest };
