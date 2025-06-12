import { createWagmiConfig, createWeb3ModalInstance } from '@/config/web3Modal';
import { getAccount } from '@wagmi/core';
import { LocalStorage } from 'fuels';
import { useState } from 'react';

export const useEvm = () => {
  const storage = new LocalStorage(window.localStorage as Storage);

  const wagmiConfig = createWagmiConfig();
  const modal = createWeb3ModalInstance({
    wagmiConfig,
  });

  const { isConnected: wagmiConnected } = getAccount(wagmiConfig);
  const [isConnected, setIsConnected] = useState<boolean>(wagmiConnected);

  const accountHasValidation = async (
    account: `0x${string}` | string | undefined,
  ) => {
    if (!account) return false;
    const [hasValidate] = await getAccountValidations([account]);
    return hasValidate;
  };

  const getAccountValidations = async (
    accounts: `0x${string}`[] | string[],
  ): Promise<boolean[]> => {
    return Promise.all(
      accounts.map(async (a) => {
        const isValidated = await storage.getItem(`SIGNATURE_VALIDATION_${a}`);
        return isValidated === 'true';
      }),
    );
  };

  const unsub = modal.subscribeEvents(async (event) => {
    if (isConnected) {
      return true;
    }

    switch (event.data.event) {
      case 'CONNECT_SUCCESS': {
        setIsConnected(true);
        const { addresses = [] } = getAccount(wagmiConfig);
        for (const address of addresses) {
          if (await accountHasValidation(address)) {
            continue;
          }

          storage.setItem(`SIGNATURE_VALIDATION_${address}`, 'pending');
        }

        unsub();
        break;
      }
      case 'DISCONNECT_SUCCESS': {
        setIsConnected(false);
        unsub();
        break;
      }
      case 'MODAL_CLOSE':
      case 'CONNECT_ERROR': {
        console.log('MODAL_CLOSE or CONNECT_ERROR');
        unsub();
        break;
      }
    }
  });

  const connect = async () => {
    await modal.open();
  };

  return { wagmiConfig, connect, isConnected };
};
