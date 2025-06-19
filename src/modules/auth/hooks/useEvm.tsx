import { getAccount, Config } from '@wagmi/core';
import { Web3Modal as WagmiWeb3Modal } from '@web3modal/wagmi';
import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
} from '@ethereumjs/util';
import { LocalStorage } from 'fuels';
import { useEffect, useRef, useState } from 'react';
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

const wagmiConfig: Config = createWagmiConfig();

const getSignatureValidationKey = (_address: string) =>
  `SIGNATURE_VALIDATION_${_address}`;

export const useEvm = (
  callback: (vaultId?: string, workspaceId?: string) => void = (
    _vaultId?: string,
    _workspaceId?: string,
  ) => null,
) => {
  const storage = new LocalStorage(window.localStorage as Storage);

  const { errorToast } = useContactToast();
  const { authDetails, invalidateGifAnimationRequest } = useWorkspaceContext();

  const { isConnected: wagmiConnected, addresses: wagmiAddresses } =
    getAccount(wagmiConfig);

  const modal = useRef<WagmiWeb3Modal>(
    createWeb3ModalInstance({
      wagmiConfig,
    }),
  );
  const [isConnected, setIsConnected] = useState<boolean>(wagmiConnected);
  const [address, setAddress] = useState<string>(
    wagmiAddresses ? wagmiAddresses[0] : '',
  );

  const accountHasValidation = async (_address: string | undefined) => {
    if (!_address) return false;
    const hasValidate = await getAccountValidations(_address);
    return hasValidate;
  };

  const getAccountValidations = async (
    _address: `0x${string}` | string,
  ): Promise<boolean> => {
    const isValidated = await storage.getItem(
      getSignatureValidationKey(_address),
    );
    return isValidated === 'true';
  };

  const handleConnectSuccess = async () => {
    const { addresses } = getAccount(wagmiConfig);

    if (addresses && addresses?.length > 0) {
      setIsConnected(true);
      const _address = addresses[0];
      setAddress(_address);

      const isValidAccount = await accountHasValidation(_address);
      if (!isValidAccount) {
        storage.setItem(
          getSignatureValidationKey(_address as string),
          'pending',
        );
      }
    }
  };

  const connect = async () => {
    await modal.current.open();
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
    _address: string,
  ): Promise<{ code: string; type: TypeUser }> =>
    new Promise(async (resolve, reject) => {
      createUserRequest.mutate(
        {
          address: _address,
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
    try {
      await requestSignature(address);
    } catch (err) {
      disconnect();
      throw err;
    }

    if (isConnected) {
      try {
        return 'validated';
      } catch (err) {
        disconnect();
        throw err;
      }
    }

    return 'pending';
  };

  const requestSignature = async (_address?: string) => {
    return new Promise(async (resolve, reject) => {
      const hasSignature = await accountHasValidation(_address);
      if (hasSignature) return resolve(true);

      const validationTimeout = setTimeout(() => {
        reject(
          new Error("User didn't provide signature in less than 1 minute"),
        );
      }, SIGNATURE_VALIDATION_TIMEOUT);

      const result = await requestCreateUserRequest(_address as string);

      signAndValidate(result.code, _address)
        .then(async (signature: string) => {
          clearTimeout(validationTimeout);
          storage.setItem(
            getSignatureValidationKey(_address as string),
            'true',
          );

          await signInRequest.mutateAsync({
            signature,
            code: result.code,
            type: TypeUser.EVM,
            encoder: Encoder.EVM,
            account: _address,
          });

          resolve(true);
        })
        .catch((err) => {
          clearTimeout(validationTimeout);
          storage.removeItem(getSignatureValidationKey(_address as string));

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

  const signAndValidate = async (message: string, _address?: string) => {
    try {
      const ethProvider = await getProviders();
      if (!ethProvider) {
        throw new Error('Invalid eth provider');
      }

      if (_address && !_address.startsWith('0x')) {
        throw new Error('Invalid account address');
      }
      const currentAddress = _address || (await getCurrentAccount());

      if (!currentAddress) {
        throw new Error('No Ethereum account selected');
      }

      const signature = (await ethProvider.request({
        method: 'personal_sign',
        params: [stringToHex(message), currentAddress],
      })) as string;

      if (!validateSignature(currentAddress, message, signature)) {
        throw new Error('Signature address validation failed');
      }

      return signature;
    } catch (error) {
      disconnect();
      throw error;
    }
  };

  const validateSignature = (
    _address: string,
    message: string,
    signature: string,
  ) => {
    const msgBuffer = Uint8Array.from(Buffer.from(message));
    const msgHash = hashPersonalMessage(msgBuffer);
    const { v, r, s } = fromRpcSig(signature);
    const pubKey = ecrecover(msgHash, v, r, s);
    const recoveredAddress = Buffer.from(pubToAddress(pubKey)).toString('hex');

    return recoveredAddress.toLowerCase() === _address.toLowerCase().slice(2);
  };

  const disconnect = async (): Promise<void> => {
    const ethProvider = await getProviders();
    if (!ethProvider) {
      throw new Error('No Ethereum provider found');
    }

    await ethProvider.request({
      method: 'wallet_revokePermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    await storage.removeItem(getSignatureValidationKey(address));

    // reset wagmi session
    // wagmiConfig = createWagmiConfig();

    setIsConnected(false);
    setAddress('');
  };

  useEffect(() => {
    const unsub = modal.current.subscribeEvents(
      async (event: { data: { event: string } }) => {
        switch (event.data.event) {
          case 'CONNECT_SUCCESS': {
            await handleConnectSuccess();
            break;
          }
          case 'DISCONNECT_SUCCESS': {
            await disconnect();
            break;
          }
          case 'CONNECT_ERROR': {
            errorToast({
              title: 'Invalid Account',
              description: 'You need to use the evm wallet to connect.',
            });
            break;
          }
          default:
            console.log('event.data.event', event.data.event);
            break;
        }
      },
    );

    return () => {
      unsub();
    };
  }, [modal]);

  return {
    wagmiConfig,
    connect,
    isConnected,
    address,
    requestSignatures,
    disconnect,
    signAndValidate,
  };
};
