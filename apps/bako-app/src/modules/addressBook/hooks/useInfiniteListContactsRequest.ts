import { WorkspaceContact } from '@bako-safe/services';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';

import { addressBookService } from '@/modules/services/services-initializer';

import { AddressBookQueryKey } from '../utils';

const useInfiniteListcontactsRequest = (
  workspaceId: string,
  value: string,
  contactIds: string,
  includePersonal: boolean,
  excludeContactsQueryKey: string,
  excludeContacts: string[] | undefined,
  perPage: number = 5,
  page: number = 0,
) => {
  const dynamicPerPage =
    excludeContacts && excludeContacts.length >= 5
      ? (perPage += perPage)
      : perPage;

  const { data, fetchNextPage, isLoading, hasNextPage, isFetching, ...query } =
    useInfiniteQuery({
      queryKey: AddressBookQueryKey.LIST_BY_USER_PAGINATED(
        workspaceId,
        value ?? '',
        contactIds,
        includePersonal,
        excludeContactsQueryKey,
      ),
      queryFn: ({ pageParam }) =>
        addressBookService.listWithPagination({
          q: value,
          excludeContacts,
          includePersonal,
          perPage: dynamicPerPage,
          page: pageParam || page,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
    });

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, isLoading, hasNextPage, isFetching],
  );

  const infinityContacts = useMemo(() => {
    return data?.pages.reduce((acc: WorkspaceContact[], page) => {
      return [...acc, ...page.data];
    }, []);
  }, [data]);

  return {
    infinityContacts,
    lastElementRef,
    data,
    ...query,
  };
};

export { useInfiniteListcontactsRequest };
