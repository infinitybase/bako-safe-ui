import { useWallets } from '@privy-io/react-auth';
import { useCallback, useMemo } from 'react';

export const useSocial = () => {
  const { wallets } = useWallets();

  const privyWallet = useMemo(
    () => wallets.find((wallet) => wallet.walletClientType === 'privy'),
    [wallets],
  );

  const signMessage = useCallback(
    async (message: string) => {
      return await privyWallet?.sign(message);
    },
    [privyWallet],
  );

  return { wallet: privyWallet, signMessage };
};
