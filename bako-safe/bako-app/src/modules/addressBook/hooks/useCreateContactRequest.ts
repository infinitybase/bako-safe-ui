import {
  AddressBookService,
  CreateContactPayload,
  CreateContactResponse,
} from '@services/modules/address-book';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

const useCreateContactRequest = (
  options?: UseMutationOptions<
    CreateContactResponse,
    unknown,
    CreateContactPayload
  >,
) => {
  return useMutation({
    mutationKey: ['address-book/create'],
    mutationFn: AddressBookService.create,
    ...options,
  });
};

export { useCreateContactRequest };
