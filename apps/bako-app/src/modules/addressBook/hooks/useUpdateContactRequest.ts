import type {
  UpdateContactPayload,
  UpdateContactResponse,
} from '@bako-safe/services';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

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
