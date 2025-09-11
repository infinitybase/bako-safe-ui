import { useFuel } from '@fuels/react';
import {
  useMutation,
  type UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import {
  bakoCoder,
  BakoProvider,
  encodeSignature,
  EncodingService,
  SignatureType,
  Vault,
} from 'bakosafe';
import type { Account } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useAuth, useEvm } from '@/modules/auth';
import { type SignWebAuthnPayload, TypeUser } from '@/modules/auth/services';
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

  //todo: validate signature if is valid
  return bakoCoder.encode({
    type: SignatureType.WebAuthn,
    ...(signature as Required<typeof signature>),
  });
};

const signAccountFuel = async (account: Account, message: string) => {
  const signature = await account.signMessage(message);
  return bakoCoder.encode({
    type: SignatureType.Fuel,
    signature,
  });
};

const useWalletSignMessage = (
  options?: UseMutationOptions<
    string,
    unknown,
    { txHash: string; predicateAddress?: string }
  >,
) => {
  const { data: wallet } = useMyWallet();

  const { signAndValidate, address: evmAddress } = useEvm();
  const {
    userInfos: { type, webauthn, network },
  } = useAuth();

  const signAccountEvm = async (txHash: string, predicateAddress: string) => {
    const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);
    const address = CookiesConfig.getCookie(CookieName.ADDRESS);

    const bakoProvider = await BakoProvider.create(network.url, {
      address,
      token,
      serverApi: import.meta.env.VITE_API_URL,
    });

    const vaultVersion = (
      await Vault.fromAddress(predicateAddress, bakoProvider)
    ).version;

    const messageToSign = EncodingService.encodeTxId(
      txHash,
      vaultVersion,
    ) as string;

    const signature = await signAndValidate(messageToSign, evmAddress);

    const encodedSignature = encodeSignature(
      evmAddress,
      signature,
      vaultVersion,
    );

    return encodedSignature;
  };

  return useMutation({
    mutationFn: async ({
      txHash,
      predicateAddress,
    }: {
      txHash: string;
      predicateAddress?: string;
    }) => {
      switch (type.type) {
        case TypeUser.WEB_AUTHN:
          return signAccountWebAuthn({
            challenge: txHash,
            id: webauthn!.id,
            publicKey: webauthn!.publicKey,
          });
        case TypeUser.EVM:
          return await signAccountEvm(txHash, predicateAddress ?? '');
        default:
          return signAccountFuel(wallet!, txHash);
      }
    },
    retry: false,
    ...options,
  });
};

export { useMyWallet, useWallet, useWalletSignMessage };
