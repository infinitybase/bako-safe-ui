import { useMutation, UseMutationOptions } from 'react-query';

import { AddressBookService, DeleteContactResponse } from '../services';

const useDeleteContactRequest = (
  options?: UseMutationOptions<DeleteContactResponse, unknown, string>,
) => {
  return useMutation('address-book/delete', AddressBookService.delete, options);
};

export { useDeleteContactRequest };
