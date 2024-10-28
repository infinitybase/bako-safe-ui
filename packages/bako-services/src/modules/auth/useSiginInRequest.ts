import { UserService } from "@/services/auth/methods";
import { Encoder, SignInResponse, UseSignInRequestParams } from "@/types";
import { useFuel } from "@fuels/react";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { Address } from "fuels";

const useSignInRequest = (
  options?: UseMutationOptions<SignInResponse, unknown, UseSignInRequestParams>,
) => {
  const { fuel } = useFuel();

  return useMutation({
    mutationKey: ["auth/sign-in"],
    mutationFn: async (params: UseSignInRequestParams) => {
      const account = await fuel.currentAccount();

      const payload = {
        encoder: Encoder.FUEL,
        digest: params.code,
        signature: await fuel.signMessage(account!, params.code),
        userAddress: Address.fromString(account!).toB256(),
      };

      return UserService.signIn(payload);
    },
    ...options,
  });
};
