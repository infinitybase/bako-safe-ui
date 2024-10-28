import { AddressBookService, DeleteContactResponse } from "@/services";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

const useDeleteContactRequest = (
  options?: UseMutationOptions<DeleteContactResponse, unknown, string>,
) => {
  return useMutation({
    mutationKey: ["address-book/delete"],
    mutationFn: AddressBookService.delete,
    ...options,
  });
};

export { useDeleteContactRequest };
