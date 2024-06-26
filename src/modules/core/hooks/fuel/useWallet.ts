import { useFuel } from '@fuels/react';
import { Account } from 'fuels';
import { useMutation, UseMutationOptions, useQuery } from 'react-query';

import { useAuth } from '@/modules/auth';
import { SignWebAuthnPayload, TypeUser } from '@/modules/auth/services';
import { useAuthStore } from '@/modules/auth/store';
import { signChallange } from '@/modules/core/utils/webauthn';

import { recoverPublicKey } from '../../utils/webauthn/crypto';
import { encodeSignature, SignatureType } from '../../utils/webauthn/encoder';
import { FuelQueryKeys } from './types';

const useWallet = (account?: string) => {
  const { fuel } = useFuel();

  return useQuery(
    [FuelQueryKeys.WALLET, account],
    () => fuel?.getWallet(account!),
    {
      enabled: !!fuel && !!account,
    },
  );
};

const useMyWallet = () => {
  const { account: currentAccount } = useAuthStore();

  return useWallet(currentAccount);
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

  const result = encodeSignature({
    type: SignatureType.WEB_AUTHN,
    ...signature!,
  });

  //todo: validate signature if is valid
  return result;
};

const signAccountFuel = async (account: Account, message: string) => {
  return await account.signMessage(message);
};

const useWalletSignMessage = (
  options?: UseMutationOptions<string, unknown, string>,
) => {
  const { data: wallet } = useMyWallet();
  const { webAuthn, accountType } = useAuth();

  return useMutation(
    async (message: string) => {
      switch (accountType) {
        case TypeUser.WEB_AUTHN:
          return signAccountWebAuthn({
            challenge: message,
            id: webAuthn!.id,
            publicKey: webAuthn!.publicKey,
          });
        default:
          return signAccountFuel(wallet!, message);
      }
    },
    {
      retry: false,
      ...options,
    },
  );
};

export { useMyWallet, useWallet, useWalletSignMessage };
