import { useQuery } from 'react-query';

import { AddressBookService } from '../services';

const useListContactsRequest = () => {
  return useQuery(['contacts/by-user'], () => AddressBookService.list(), {
    refetchOnWindowFocus: false,
  });
};

export { useListContactsRequest };
