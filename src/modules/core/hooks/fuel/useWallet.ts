import { useFuel } from '@fuels/react';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { CoderUtils } from 'bakosafe';
import { Account } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import {
  SignMessageWebAuthnPayload,
  useAuth,
  useEvm,
  WalletSignMessagePayload,
} from '@/modules/auth';
import { useSocial } from '@/modules/auth/hooks/useSocial';
import { TypeUser } from '@/modules/auth/services';
import { signChallange } from '@/modules/core/utils/webauthn';

import { EvmSignatureUtils } from '../../utils';
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
const signAccountWebAuthn = async ({
  signPayload,
  address,
  predicateVersion,
}: SignMessageWebAuthnPayload) => {
  const signature = await signChallange(
    signPayload.id,
    `0x${signPayload.challenge}`,
    signPayload.publicKey,
  );

  const publicKeyOnSignature = [
    recoverPublicKey(signature.sig_compact, signature.dig_compact, 0),
    recoverPublicKey(signature.sig_compact, signature.dig_compact, 1),
  ];

  const isValidSignature = publicKeyOnSignature.includes(signPayload.publicKey);

  if (!isValidSignature) {
    throw new Error('Invalid signature');
  }

  return CoderUtils.encodeSignature(
    address,
    signature as Required<typeof signature>,
    predicateVersion,
  );
};

const signAccountFuel = async (
  account: Account,
  message: string,
  predicateVersion?: string,
) => {
  const signature = await account.signMessage(message);
  return CoderUtils.encodeSignature(
    account.address.toB256(),
    signature,
    predicateVersion,
  );
};

const useWalletSignMessage = (
  options?: UseMutationOptions<string, unknown, WalletSignMessagePayload>,
) => {
  const { data: wallet } = useMyWallet();
  const { signAndValidate, address: evmAddress } = useEvm();
  const { wallet: socialWallet, signMessage: socialSignMessage } = useSocial();
  const {
    userInfos: { type, webauthn, address },
  } = useAuth();

  const signAccountEvm = async (message: string, predicateVersion?: string) => {
    const encodedMessage = EvmSignatureUtils.encodeMessage(
      message,
      predicateVersion,
    );
    const signature = await signAndValidate(encodedMessage);
    return CoderUtils.encodeSignature(evmAddress, signature, predicateVersion);
  };

  const signAccountSocial = async (
    message: string,
    predicateVersion?: string,
  ) => {
    const encodedMessage = EvmSignatureUtils.encodeMessage(
      message,
      predicateVersion,
    );
    const signature = await socialSignMessage(encodedMessage);
    return CoderUtils.encodeSignature(
      socialWallet?.address ?? '',
      signature ?? '',
      predicateVersion,
    );
  };

  return useMutation({
    mutationFn: async ({
      message,
      predicateVersion,
    }: WalletSignMessagePayload) => {
      switch (type.type) {
        case TypeUser.WEB_AUTHN:
          return signAccountWebAuthn({
            address,
            predicateVersion,
            signPayload: {
              challenge: message,
              id: webauthn!.id,
              publicKey: webauthn!.publicKey,
            },
          });
        case TypeUser.EVM:
          return await signAccountEvm(message, predicateVersion);
        case TypeUser.SOCIAL:
          return await signAccountSocial(message, predicateVersion);
        default:
          return signAccountFuel(wallet!, message, predicateVersion);
      }
    },
    retry: false,
    ...options,
  });
};

export { useMyWallet, useWallet, useWalletSignMessage };
