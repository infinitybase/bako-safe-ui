import { useMutation, UseMutationOptions } from 'react-query';

import {
  AddressBookService,
  FindContactsParams,
  FindContactsResponse,
} from '../services';

const useFindContactsRequest = (
  options?: UseMutationOptions<
    FindContactsResponse,
    unknown,
    FindContactsParams
  >,
) => {
  return useMutation(
    'contacts/find',
    (params) => AddressBookService.find(params),
    options,
  );
};

export { useFindContactsRequest };
