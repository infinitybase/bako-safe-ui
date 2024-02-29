import { useFuel } from '@fuels/react';
import { useMutation, UseMutationOptions, useQuery } from 'react-query';

import { useAuthStore } from '@/modules/auth/store';

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

const useWalletSignMessage = (
  options?: UseMutationOptions<string, unknown, string>,
) => {
  const { data: wallet } = useMyWallet();

  return useMutation((message: string) => wallet!.signMessage(message), {
    retry: false,
    ...options,
  });
};

export { useMyWallet, useWallet, useWalletSignMessage };
