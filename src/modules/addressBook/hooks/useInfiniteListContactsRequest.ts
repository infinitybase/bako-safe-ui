import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';

import { AddressBookQueryKey, WorkspaceContact } from '@/modules/core';
import { DEFAULT_INITIAL_PAGE_PARAM } from '@/utils/constants';

import { AddressBookService } from '../services';

const useInfiniteListcontactsRequest = (
  workspaceId: string,
  value: string,
  contactIds: string,
  includePersonal: boolean,
  excludeContactsQueryKey: string,
  excludeContacts: string[] | undefined,
  perPage: number = 5,
  page: number = DEFAULT_INITIAL_PAGE_PARAM,
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
        AddressBookService.listWithPagination({
          q: value,
          excludeContacts,
          includePersonal,
          perPage: dynamicPerPage,
          page: pageParam || page,
        }),
      initialPageParam: DEFAULT_INITIAL_PAGE_PARAM,
      getNextPageParam: (lastPage) =>
        lastPage.data.length < lastPage.perPage ? undefined : lastPage.nextPage,
    });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (!observer.current) {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        });
      } else {
        observer.current.disconnect();
      }

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
