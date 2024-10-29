import {
  AddressBookService,
  DeleteContactResponse,
} from '@bako-safe/services/modules/address-book';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

const useDeleteContactRequest = (
  options?: UseMutationOptions<DeleteContactResponse, unknown, string>,
) => {
  return useMutation({
    mutationKey: ['address-book/delete'],
    mutationFn: AddressBookService.delete,
    ...options,
  });
};

export { useDeleteContactRequest };
