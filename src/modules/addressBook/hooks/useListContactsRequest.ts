import { useQuery } from '@tanstack/react-query';

import { AddressBookQueryKey } from '@/modules/core';

import { AddressBookService } from '../services';
import { CookieName, CookiesConfig } from '@/config/cookies';

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
    enabled: !!CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
  });
};

export { useListContactsRequest };
