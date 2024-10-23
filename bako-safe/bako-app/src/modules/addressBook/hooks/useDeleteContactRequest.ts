import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AddressBookService, DeleteContactResponse } from '../services';

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
