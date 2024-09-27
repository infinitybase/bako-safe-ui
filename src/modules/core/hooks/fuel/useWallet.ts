import { useFuel } from '@fuels/react';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { bakoCoder, SignatureType } from 'bakosafe';
import { Account } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useAuth } from '@/modules/auth';
import { SignWebAuthnPayload, TypeUser } from '@/modules/auth/services';
import { signChallange } from '@/modules/core/utils/webauthn';

import { recoverPublicKey } from '../../utils/webauthn/crypto';
import { FuelQueryKeys } from './types';

const useWallet = (account?: string) => {
  const { fuel } = useFuel();

  return useQuery({
    queryKey: [FuelQueryKeys.WALLET, account],
    queryFn: () => fuel?.getWallet(account!),
    enabled: !!fuel && !!account,
  });
};

const useMyWallet = () => {
  return useWallet(CookiesConfig.getCookie(CookieName.ADDRESS));
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
    ...signature!,
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
  options?: UseMutationOptions<string, unknown, string>,
) => {
  const { data: wallet } = useMyWallet();
  const {
    userInfos: { type, webauthn },
  } = useAuth();

  return useMutation({
    mutationFn: async (message: string) => {
      switch (type) {
        case TypeUser.WEB_AUTHN:
          return signAccountWebAuthn({
            challenge: message,
            id: webauthn!.id,
            publicKey: webauthn!.publicKey,
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
