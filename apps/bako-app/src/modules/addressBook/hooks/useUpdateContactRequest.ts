import {
  AddressBookService,
  UpdateContactPayload,
  UpdateContactResponse,
} from '@bako-safe/services/modules/address-book';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

const useUpdateContactRequest = (
  options?: UseMutationOptions<
    UpdateContactResponse,
    unknown,
    UpdateContactPayload
  >,
) => {
  return useMutation({
    mutationKey: ['address-book/update'],
    mutationFn: AddressBookService.update,
    ...options,
  });
};

export { useUpdateContactRequest };
