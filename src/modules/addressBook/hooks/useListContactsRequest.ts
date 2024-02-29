import { useQuery } from 'react-query';

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
  return useQuery(
    [...AddressBookQueryKey.LIST_BY_USER(current), includePersonal],
    () => AddressBookService.list(includePersonal),
    {
      refetchOnWindowFocus: false,
    },
  );
};

export { useListContactsRequest };
