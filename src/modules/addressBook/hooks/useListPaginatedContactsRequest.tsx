import { SortOption } from 'bsafe';
import { useInfiniteQuery } from 'react-query';

import { AddressBookService, GetPaginatedContactsParams } from '../services';

export const CONTACTS_PAGINATE_LIST_QUERY_KEY = 'contacts/pagination';

const useListPaginatedContactsRequest = (
  filter: GetPaginatedContactsParams,
) => {
  const { data, ...query } = useInfiniteQuery(
    [CONTACTS_PAGINATE_LIST_QUERY_KEY, filter],
    ({ pageParam }) =>
      AddressBookService.listWithPagination({
        ...filter,
        perPage: 5,
        page: pageParam || 0,
        orderBy: 'nickname',
        sort: SortOption.ASC,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
      refetchOnWindowFocus: false,
    },
  );

  return {
    ...query,
    contacts: data?.pages.map((page) => page.data).flat() ?? [],
  };
};

export { useListPaginatedContactsRequest };
