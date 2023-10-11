import { useInfiniteQuery } from 'react-query';

import { GetAllPredicatesPayload, VaultService } from '../services';

const useVaultListRequest = (
  filter: GetAllPredicatesPayload,
  enabled?: boolean,
) => {
  const { data, ...query } = useInfiniteQuery(
    ['vault/pagination', filter],
    ({ pageParam }) =>
      VaultService.getAllWithPagination({
        ...filter,
        perPage: 5,
        page: pageParam || 0,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
      enabled,
    },
  );

  return {
    vaults: data?.pages.map((page) => page.data).flat() ?? [],
    ...query,
  };
};

export { useVaultListRequest };
