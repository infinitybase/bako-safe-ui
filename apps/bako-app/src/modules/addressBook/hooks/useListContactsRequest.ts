import { useQuery } from '@tanstack/react-query';

import { useServicesContext } from '@/modules/services/ServicesProvider';

import { AddressBookQueryKey } from '../utils';

type UseListContactsRequestParams = {
  workspaceId: string;
  includePersonal: boolean;
};

const useListContactsRequest = ({
  workspaceId,
  includePersonal,
}: UseListContactsRequestParams) => {
  const { addressBookService } = useServicesContext();
  return useQuery({
    queryKey: [
      ...AddressBookQueryKey.LIST_BY_USER(workspaceId),
      includePersonal,
    ],
    queryFn: () => addressBookService.list(includePersonal),
    refetchOnWindowFocus: false,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { useListContactsRequest };
