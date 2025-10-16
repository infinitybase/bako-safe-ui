import type EventEmitter from 'node:events';

import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
} from '@ethereumjs/util';
import { Config, getAccount, reconnect, watchAccount } from '@wagmi/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { stringToHex } from 'viem';

import { createWagmiConfig, createWeb3ModalInstance } from '@/config/web3Modal';

export interface EIP1193Provider extends EventEmitter {
  request(args: {
    method: string;
    params?: unknown[];
  }): Promise<unknown | unknown[]>;
}

const wagmiConfig: Config = createWagmiConfig();

const modal = createWeb3ModalInstance({
  wagmiConfig,
});

export const useEvm = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const unwatchRef = useRef<(() => void) | null>(null);

  const connect = async () => {
    try {
      await modal.open();
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  };

  const getProviders = useCallback(async (): Promise<EIP1193Provider> => {
    const account = getAccount(wagmiConfig);

    if (!account.isConnected || !account.connector) {
      throw new Error('Wallet not connected');
    }

    const ethProvider =
      (await account.connector.getProvider?.()) as EIP1193Provider;

    if (!ethProvider) {
      throw new Error('No Ethereum provider found');
    }

    return ethProvider;
  }, []);

  const getCurrentAccount = async (): Promise<string> => {
    const account = getAccount(wagmiConfig);
    if (account.address) {
      return account.address;
    }

    const ethProvider = await getProviders();
    const accounts = (await ethProvider.request({
      method: 'eth_requestAccounts',
    })) as string[];

    return accounts[0];
  };

  const signAndValidate = async (message: string, _address?: string) => {
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
    try {
      const account = getAccount(wagmiConfig);
      if (account.connector?.disconnect) {
        await account.connector.disconnect();
      } else {
        const ethProvider = await getProviders();
        await ethProvider.request({
          method: 'wallet_revokePermissions',
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
      }
    } catch (error) {
      console.error('Disconnect failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        await reconnect(wagmiConfig);

        const account = getAccount(wagmiConfig);
        setIsConnected(account.isConnected);
        setAddress(account.address || '');
      } catch (error) {
        console.error('Failed to reconnect:', error);
      }
    };

    initializeConnection();
  }, []);

  useEffect(() => {
    if (unwatchRef.current) {
      unwatchRef.current();
    }

    // Set up account watcher
    unwatchRef.current = watchAccount(wagmiConfig, {
      onChange(account) {
        setIsConnected(account.isConnected);
        setAddress(account.address || '');
      },
    });

    return () => {
      if (unwatchRef.current) {
        unwatchRef.current();
      }
    };
  }, []);

  return {
    modal,
    connect,
    isConnected,
    disconnect,
    signAndValidate,
    address,
    getCurrentAccount,
  };
};
