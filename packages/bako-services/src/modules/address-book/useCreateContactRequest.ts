import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  AddressBookService,
  CreateContactPayload,
  CreateContactResponse,
} from "@/services";

const useCreateContactRequest = (
  options?: UseMutationOptions<
    CreateContactResponse,
    unknown,
    CreateContactPayload
  >,
) => {
  return useMutation({
    mutationKey: ["address-book/create"],
    mutationFn: AddressBookService.create,
    ...options,
  });
};

export { useCreateContactRequest };
