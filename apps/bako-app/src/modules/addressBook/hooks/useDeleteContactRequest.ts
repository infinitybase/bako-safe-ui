import { DeleteContactResponse } from '@bako-safe/services/modules/address-book';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { addressBookService } from '@/config/services-initializer';

const useDeleteContactRequest = (
  options?: UseMutationOptions<DeleteContactResponse, unknown, string>,
) => {
  return useMutation({
    mutationKey: ['address-book/delete'],
    mutationFn: addressBookService.delete,
    ...options,
  });
};

export { useDeleteContactRequest };
