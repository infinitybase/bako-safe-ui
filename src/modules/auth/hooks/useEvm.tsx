import { disconnect as wagmiDisconnect, getAccount, Config } from '@wagmi/core';
import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
} from '@ethereumjs/util';
import { useFuel } from '@fuels/react';
import { LocalStorage } from 'fuels';
import { useState } from 'react';
import type EventEmitter from 'node:events';
import { stringToHex } from 'viem';

import { createWagmiConfig, createWeb3ModalInstance } from '@/config/web3Modal';
import { useContactToast } from '@/modules/addressBook';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Encoder, TypeUser } from '../services';
import { useCreateUserRequest, useSignInRequest } from './useUserRequest';

export interface EIP1193Provider extends EventEmitter {
  request(args: {
    method: string;
    params?: unknown[];
  }): Promise<unknown | unknown[]>;
}

const SIGNATURE_VALIDATION_TIMEOUT = 1000 * 60;

let wagmiConfig: Config = createWagmiConfig();

const getSignatureValidationKey = (address: string) =>
  `SIGNATURE_VALIDATION_${address}`;

export const useEvm = (
  callback: (vaultId?: string, workspaceId?: string) => void,
) => {
  const storage = new LocalStorage(window.localStorage as Storage);
  const modal = createWeb3ModalInstance({
    wagmiConfig,
  });

  const { fuel } = useFuel();
  const { errorToast } = useContactToast();
  const { authDetails, invalidateGifAnimationRequest } = useWorkspaceContext();

  const { isConnected: wagmiConnected, addresses: wagmiAddresses } =
    getAccount(wagmiConfig);

  const [isConnected, setIsConnected] = useState<boolean>(wagmiConnected);
  const [addresses, setAddresses] = useState<string[]>(
    wagmiAddresses?.map((a) => a) || [],
  );

  const accountHasValidation = async (address: string | undefined) => {
    if (!address) return false;
    const [hasValidate] = await getAccountValidations([address]);
    return hasValidate;
  };

  const getAccountValidations = async (
    accounts: `0x${string}`[] | string[],
  ): Promise<boolean[]> => {
    return Promise.all(
      accounts.map(async (a) => {
        const isValidated = await storage.getItem(getSignatureValidationKey(a));
        return isValidated === 'true';
      }),
    );
  };

  const handleConnectSuccess = async () => {
    setIsConnected(true);
    const { addresses = [] } = getAccount(wagmiConfig);

    setAddresses(addresses as string[]);

    for (const address of addresses) {
      if (await accountHasValidation(address)) {
        continue;
      }

      storage.setItem(getSignatureValidationKey(address as string), 'pending');
    }
  };

  const handleDisconnectSuccess = () => {
    setIsConnected(false);
    setAddresses([]);
  };

  const unsub = modal.subscribeEvents(async (event) => {
    if (isConnected) {
      return true;
    }

    switch (event.data.event) {
      case 'CONNECT_SUCCESS': {
        await handleConnectSuccess();
        unsub();
        break;
      }
      case 'DISCONNECT_SUCCESS': {
        handleDisconnectSuccess();
        unsub();
        break;
      }
      case 'MODAL_CLOSE':
      case 'CONNECT_ERROR': {
        unsub();
        break;
      }
    }
  });

  const connect = async () => {
    await modal.open();
  };

  const createUserRequest = useCreateUserRequest({
    onError: (message) => {
      errorToast({
        title: 'Login error',
        description: (message as { message: string }).message,
      });
    },
  });

  const requestCreateUserRequest = (
    account: string,
  ): Promise<{ code: string; type: TypeUser }> =>
    new Promise(async (resolve, reject) => {
      createUserRequest.mutate(
        {
          address: account,
          provider: import.meta.env.VITE_NETWORK,
          type: TypeUser.EVM,
        },
        {
          onSuccess: ({ code, type }) => {
            return resolve({ code, type });
          },
          onError: (err) => {
            return reject(err);
          },
        },
      );
    });

  const requestSignatures = async (): Promise<'validated' | 'pending'> => {
    const account = getAccount(wagmiConfig!);

    const { isConnected } = account;
    for (const address of addresses) {
      try {
        await requestSignature(address);
      } catch (err) {
        disconnect();
        throw err;
      }
    }

    if (isConnected) {
      try {
        // await this.handleConnect(account);
        return 'validated';
      } catch (err) {
        disconnect();
        throw err;
      }
    }

    return 'pending';
  };

  const requestSignature = async (address?: string) => {
    return new Promise(async (resolve, reject) => {
      const hasSignature = await accountHasValidation(address);
      if (hasSignature) return resolve(true);

      const validationTimeout = setTimeout(() => {
        reject(
          new Error("User didn't provide signature in less than 1 minute"),
        );
      }, SIGNATURE_VALIDATION_TIMEOUT);

      const ethProvider = await getProviders();
      if (!ethProvider) {
        return;
      }

      const result = await requestCreateUserRequest(address as string);

      signAndValidate(ethProvider, result.code, address)
        .then(() => {
          clearTimeout(validationTimeout);
          storage.setItem(getSignatureValidationKey(address as string), 'true');
          resolve(true);
        })
        .catch((err) => {
          clearTimeout(validationTimeout);
          storage.removeItem(getSignatureValidationKey(address as string));

          reject(err);
        });
    });
  };

  const getProviders = async (): Promise<EIP1193Provider> => {
    const ethProvider = wagmiConfig
      ? ((await getAccount(
          wagmiConfig,
        ).connector?.getProvider?.()) as EIP1193Provider)
      : undefined;
    if (!ethProvider) {
      throw new Error('No Ethereum provider found');
    }

    return ethProvider;
  };

  const signInRequest = useSignInRequest({
    onSuccess: ({
      accessToken,
      avatar,
      user_id,
      workspace,
      address,
      rootWallet,
      provider,
      first_login,
    }) => {
      authDetails.handlers.authenticate({
        userId: user_id,
        avatar: avatar!,
        account: address,
        accountType: TypeUser.EVM,
        accessToken: accessToken,
        singleWorkspace: workspace.id,
        permissions: workspace.permissions,
        provider_url: provider,
        first_login,
      });
      invalidateGifAnimationRequest();
      callback(rootWallet, workspace.id);
    },
  });

  const getCurrentAccount = async (): Promise<string> => {
    const ethProvider = await getProviders();
    return (
      (await ethProvider.request({
        method: 'eth_requestAccounts',
      })) as string[]
    )[0];
  };

  const signAndValidate = async (
    ethProvider: EIP1193Provider,
    message: string,
    account?: string,
  ) => {
    try {
      if (account && !account.startsWith('0x')) {
        throw new Error('Invalid account address');
      }
      const currentAccount = account || (await getCurrentAccount());

      if (!currentAccount) {
        throw new Error('No Ethereum account selected');
      }

      const signature = (await ethProvider.request({
        method: 'personal_sign',
        params: [stringToHex(message), currentAccount],
      })) as string;

      if (!validateSignature(currentAccount, message, signature)) {
        throw new Error('Signature address validation failed');
      }

      await signInRequest.mutateAsync({
        signature,
        code: message,
        type: TypeUser.EVM,
        encoder: Encoder.EVM,
        account: currentAccount,
      });

      return true;
    } catch (error) {
      disconnect();
      throw error;
    }
  };

  const validateSignature = (
    account: string,
    message: string,
    signature: string,
  ) => {
    const msgBuffer = Uint8Array.from(Buffer.from(message));
    const msgHash = hashPersonalMessage(msgBuffer);
    const { v, r, s } = fromRpcSig(signature);
    const pubKey = ecrecover(msgHash, v, r, s);
    const recoveredAddress = Buffer.from(pubToAddress(pubKey)).toString('hex');

    return recoveredAddress.toLowerCase() === account.toLowerCase().slice(2);
  };

  const disconnect = async (): Promise<boolean> => {
    if (!wagmiConfig) throw new Error('Wagmi config not found');

    const { connector, isConnected } = getAccount(wagmiConfig);
    await wagmiDisconnect(wagmiConfig, {
      connector,
    });

    // reset wagmi session
    wagmiConfig = createWagmiConfig();

    return isConnected || false;
  };

  return { wagmiConfig, connect, isConnected, addresses, requestSignatures };
};
