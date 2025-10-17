import { useFuel } from '@fuels/react';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { CoderUtils } from 'bakosafe';
import { Account } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useAuth, useEvm } from '@/modules/auth';
import { SignWebAuthnPayload, TypeUser } from '@/modules/auth/services';
import { signChallange } from '@/modules/core/utils/webauthn';

import { recoverPublicKey } from '../../utils/webauthn/crypto';
import { FuelQueryKeys } from './types';

const useWallet = (account?: string) => {
  const { fuel } = useFuel();

  return useQuery({
    queryKey: [FuelQueryKeys.WALLET, account],
    queryFn: () => {
      return fuel?.getWallet(account!);
    },
    enabled: !!fuel && !!account,
  });
};

const getAddresFromCookie = () => CookiesConfig.getCookie(CookieName.ADDRESS);

const useMyWallet = () => {
  return useWallet(getAddresFromCookie());
};

//sign by webauthn
const signAccountWebAuthn = async (
  address: string,
  sign: SignWebAuthnPayload,
) => {
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

  return CoderUtils.encodeSignature(
    address,
    signature as Required<typeof signature>,
  );
};

const signAccountFuel = async (account: Account, message: string) => {
  const signature = await account.signMessage(message);
  return CoderUtils.encodeSignature(account.address.toB256(), signature);
};

const useWalletSignMessage = (
  options?: UseMutationOptions<string, unknown, string>,
) => {
  const { data: wallet } = useMyWallet();
  const { signAndValidate, address: evmAddress } = useEvm();
  const {
    userInfos: { type, webauthn, address },
  } = useAuth();

  const signAccountEvm = async (message: string) => {
    const signature = await signAndValidate(message);
    return CoderUtils.encodeSignature(evmAddress, signature);
  };

  return useMutation({
    mutationFn: async (message: string) => {
      switch (type.type) {
        case TypeUser.WEB_AUTHN:
          return signAccountWebAuthn(address, {
            challenge: message,
            id: webauthn!.id,
            publicKey: webauthn!.publicKey,
          });
        case TypeUser.EVM:
          return await signAccountEvm(message);
        default:
          return signAccountFuel(wallet!, message);
      }
    },
    retry: false,
    ...options,
  });
};

export { useMyWallet, useWallet, useWalletSignMessage };
