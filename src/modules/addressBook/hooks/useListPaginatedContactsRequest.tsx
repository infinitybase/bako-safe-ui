import { SortOption } from 'bsafe';
import { useInfiniteQuery } from 'react-query';

import { AddressBookService } from '../services';

export const CONTACTS_PAGINATE_LIST_QUERY_KEY = 'transactions/pagination';

const useListPaginatedContactsRequest = (enabled: boolean) => {
  const { data, ...query } = useInfiniteQuery(
    [CONTACTS_PAGINATE_LIST_QUERY_KEY],
    ({ pageParam }) =>
      AddressBookService.listWithPagination({
        perPage: 5,
        page: pageParam || 0,
        orderBy: 'nickname',
        sort: SortOption.ASC,
      }),
    {
      enabled,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) =>
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
    },
  );

  return {
    ...query,
    contacts: data?.pages.map((page) => page.data).flat() ?? [],
  };
};

export { useListPaginatedContactsRequest };
