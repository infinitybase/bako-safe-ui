import { useQuery } from 'react-query';

import { AddressBookQueryKey } from '@/modules/core';

import { AddressBookService } from '../services';
import { useAddressBookStore } from '../store/useAddressBookStore';

const useListContactsRequest = (
  current: string,
  includePersonal: boolean,
  vaultId?: string,
) => {
  const { setContacts } = useAddressBookStore();

  return useQuery(
    AddressBookQueryKey.LIST_BY_USER(current, vaultId),
    () => AddressBookService.list(includePersonal),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setContacts(data);
      },
    },
  );
};

export { useListContactsRequest };
