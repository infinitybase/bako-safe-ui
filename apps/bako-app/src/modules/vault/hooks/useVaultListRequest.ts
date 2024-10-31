import { GetAllPredicatesPayload } from '@bako-safe/services/modules/vault';
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
    vaults: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useVaultListRequest };
