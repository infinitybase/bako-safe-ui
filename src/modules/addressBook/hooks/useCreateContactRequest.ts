import { useMutation, UseMutationOptions } from 'react-query';

import {
  AddressBookService,
  CreateContactPayload,
  CreateContactResponse,
} from '../services';

const useCreateContactRequest = (
  options?: UseMutationOptions<
    CreateContactResponse,
    unknown,
    CreateContactPayload
  >,
) => {
  return useMutation('address-book/create', AddressBookService.create, options);
};

export { useCreateContactRequest };
