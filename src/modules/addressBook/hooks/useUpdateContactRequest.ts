import { useMutation, UseMutationOptions } from 'react-query';

import {
  AddressBookService,
  UpdateContactPayload,
  UpdateContactResponse,
} from '../services';

const useUpdateContactRequest = (
  options?: UseMutationOptions<
    UpdateContactResponse,
    unknown,
    UpdateContactPayload
  >,
) => {
  return useMutation('address-book/update', AddressBookService.update, options);
};

export { useUpdateContactRequest };
