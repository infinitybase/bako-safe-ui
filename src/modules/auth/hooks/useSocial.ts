import { useWallets } from '@privy-io/react-auth';
import { useCallback, useMemo } from 'react';

import { EvmSignatureUtils } from '@/modules/core/utils';

export const useSocial = () => {
  const { wallets } = useWallets();

  const privyWallet = useMemo(
    () => wallets.find((wallet) => wallet.walletClientType === 'privy'),
    [wallets],
  );

  const signMessage = useCallback(
    async (message: string) => {
      if (!privyWallet) throw new Error('No wallet found');

      const { address } = privyWallet;
      const isHex = EvmSignatureUtils.isMessageHex(message);
      let signature: string | undefined;

      if (isHex) {
        const provider = await privyWallet.getEthereumProvider?.();
        if (!provider) throw new Error('No provider found');

        signature = await provider.request({
          method: 'personal_sign',
          params: [message, address],
        });
      } else {
        signature = await privyWallet.sign(message);
      }

      if (
        !EvmSignatureUtils.validateSignature(address, message, signature ?? '')
      ) {
        throw new Error('Signature address validation failed');
      }

      return signature;
    },
    [privyWallet],
  );

  return { wallet: privyWallet, signMessage };
};
