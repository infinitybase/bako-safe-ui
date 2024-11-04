import { SignWebAuthnPayload } from '@bako-safe/services/types';
import { signChallange } from '@bako-safe/services/utils';
import { useFuel } from '@fuels/react';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { bakoCoder, recoverPublicKey, SignatureType, TypeUser } from 'bakosafe';
import { Account } from 'fuels';

import { FuelQueryKeys } from './types';

const useWallet = (account?: string) => {
  const { fuel } = useFuel();

  return useQuery({
    queryKey: [FuelQueryKeys.WALLET, account],
    queryFn: () => fuel?.getWallet(account!),
    enabled: !!fuel && !!account,
  });
};

const useMyWallet = (userAddress: string) => {
  return useWallet(userAddress);
};

//sign by webauthn
const signAccountWebAuthn = async (sign: SignWebAuthnPayload) => {
  const signature = await signChallange(
    sign.id,
    `0x${sign.challenge}`,
    sign.publicKey,
  );

  const publicKeyOnSignature = [
    recoverPublicKey(signature.sig_compact, signature.dig_compact, 0),
    recoverPublicKey(signature.sig_compact, signature.dig_compact, 1),
  ];

  const isValidSignature = publicKeyOnSignature.includes(sign.publicKey);

  if (!isValidSignature) {
    throw new Error('Invalid signature');
  }

  const result = bakoCoder.encode({
    type: SignatureType.WebAuthn,
    ...(signature as Required<typeof signature>),
  });

  //todo: validate signature if is valid
  return result;
};

const signAccountFuel = async (account: Account, message: string) => {
  const signature = await account.signMessage(message);
  return bakoCoder.encode({
    type: SignatureType.Fuel,
    signature,
  });
};

const useWalletSignMessage = (
  userAddress: string,
  type: TypeUser,
  webauthnId: string,
  webauthnPublicKey: string,
  options?: UseMutationOptions<string, unknown, string>,
) => {
  const { data: wallet } = useMyWallet(userAddress);

  return useMutation({
    mutationFn: async (message: string) => {
      switch (type) {
        case TypeUser.WEB_AUTHN:
          return signAccountWebAuthn({
            challenge: message,
            id: webauthnId,
            publicKey: webauthnPublicKey,
          });
        default:
          return signAccountFuel(wallet!, message);
      }
    },
    retry: false,
    ...options,
  });
};

export { useMyWallet, useWallet, useWalletSignMessage };
