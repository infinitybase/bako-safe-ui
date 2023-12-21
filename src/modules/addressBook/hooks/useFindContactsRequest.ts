import { useMutation, UseMutationOptions } from 'react-query';

import {
  AddressBookService,
  FindContactsParams,
  FindContactsResponse,
} from '../services';

export const FIND_CONTACTS_QUERY_KEY = 'contacts/find';

const useFindContactsRequest = (
  options?: UseMutationOptions<
    FindContactsResponse,
    unknown,
    FindContactsParams
  >,
) => {
  return useMutation(
    FIND_CONTACTS_QUERY_KEY,
    (params) => AddressBookService.find(params),
    options,
  );
};

export { useFindContactsRequest };
