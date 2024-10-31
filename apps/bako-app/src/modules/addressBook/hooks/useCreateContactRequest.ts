import {
  CreateContactPayload,
  CreateContactResponse,
} from '@bako-safe/services/modules/address-book';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { addressBookService } from '@/modules/services/services-initializer';

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
