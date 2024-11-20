import type {
  CreateContactPayload,
  CreateContactResponse,
} from '@bako-safe/services';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { addressBookService } from '@/config/services-initializer';

const useCreateContactRequest = (
  options?: UseMutationOptions<
    CreateContactResponse,
    unknown,
    CreateContactPayload
  >,
) => {
  return useMutation({
    mutationKey: ['address-book/create'],
    mutationFn: addressBookService.create,
    ...options,
  });
};

export { useCreateContactRequest };
