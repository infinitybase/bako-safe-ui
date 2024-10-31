import {
  UpdateContactPayload,
  UpdateContactResponse,
} from '@bako-safe/services/modules/address-book';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { addressBookService } from '@/config/services-initializer';

const useUpdateContactRequest = (
  options?: UseMutationOptions<
    UpdateContactResponse,
    unknown,
    UpdateContactPayload
  >,
) => {
  return useMutation({
    mutationKey: ['address-book/update'],
    mutationFn: addressBookService.update,
    ...options,
  });
};

export { useUpdateContactRequest };
