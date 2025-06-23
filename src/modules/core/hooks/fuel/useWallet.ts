import { useFuel } from '@fuels/react';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { bakoCoder, SignatureType } from 'bakosafe';
import { Account, Address, arrayify, isEvmAddress } from 'fuels';
import { stringToHex } from 'viem';

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

const encodeTxIdUtf8 = (txId: string): string => {
  const txIdNo0x = txId.slice(2);
  return stringToHex(txIdNo0x);
};

const useWalletSignMessage = (
  options?: UseMutationOptions<string, unknown, string>,
) => {
  const { data: wallet } = useMyWallet();
  const { signAndValidate } = useEvm();
  const {
    userInfos: { type, webauthn },
  } = useAuth();

  const signAccountEvm = async (message: string) => {
    const signature = await signAndValidate(encodeTxIdUtf8(message));
    return bakoCoder.encode({
      type: SignatureType.Evm,
      signature,
    });
  };

  return useMutation({
    mutationFn: async (message: string) => {
      switch (type.type) {
        case TypeUser.WEB_AUTHN:
          return signAccountWebAuthn({
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
