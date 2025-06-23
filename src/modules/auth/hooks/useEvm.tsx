import { getAccount, Config } from '@wagmi/core';
import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
} from '@ethereumjs/util';
import { useState } from 'react';
import type EventEmitter from 'node:events';
import { stringToHex } from 'viem';

import { createWagmiConfig, createWeb3ModalInstance } from '@/config/web3Modal';

export interface EIP1193Provider extends EventEmitter {
  request(args: {
    method: string;
    params?: unknown[];
  }): Promise<unknown | unknown[]>;
}

const wagmiConfig: Config = createWagmiConfig();

let _modal = createWeb3ModalInstance({
  wagmiConfig,
});

export const useEvm = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, _setAddress] = useState<string>('');

  const connect = async () => {
    await _modal.open();
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
  };

  return {
    modal: _modal,
    wagmiConfig,
    connect,
    isConnected,
    address,
    disconnect,
    signAndValidate,
    getAccount,
    setAddress: (address: string) => {
      _setAddress(address);
      setIsConnected(true);
    },
  };
};
