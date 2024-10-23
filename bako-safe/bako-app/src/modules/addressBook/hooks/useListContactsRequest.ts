import { useQuery } from '@tanstack/react-query';

import { AddressBookQueryKey } from '@/modules/core';

import { AddressBookService } from '../services';

type UseListContactsRequestParams = {
  workspaceId: string;
  includePersonal: boolean;
};

const useListContactsRequest = ({
  workspaceId,
  includePersonal,
}: UseListContactsRequestParams) => {
  return useQuery({
    queryKey: [
      ...AddressBookQueryKey.LIST_BY_USER(workspaceId),
      includePersonal,
    ],
    queryFn: () => AddressBookService.list(includePersonal),
    refetchOnWindowFocus: false,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { useListContactsRequest };
