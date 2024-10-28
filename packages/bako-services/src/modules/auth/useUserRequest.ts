import { UserService } from "@/services/auth/methods";
import { CreateUserPayload, CreateUserResponse } from "@/types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";

const useCreateUserRequest = (
  options?: UseMutationOptions<CreateUserResponse, unknown, CreateUserPayload>,
) => {
  return useMutation({
    mutationKey: ["user/create"],
    mutationFn: UserService.create,
    ...options,
  });
};

export { useCreateUserRequest };
