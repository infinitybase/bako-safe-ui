import { useQuery } from '@tanstack/react-query';

import { AddressBookQueryKey } from '@/modules/core';

import { AddressBookService } from '../services';

type UseListContactsRequestParams = {
  current: string;
  includePersonal: boolean;
};

const useListContactsRequest = ({
  current,
  includePersonal,
}: UseListContactsRequestParams) => {
  return useQuery({
    queryKey: [...AddressBookQueryKey.LIST_BY_USER(current), includePersonal],
    queryFn: () => AddressBookService.list(includePersonal),
    refetchOnWindowFocus: false,
  });
};

export { useListContactsRequest };
