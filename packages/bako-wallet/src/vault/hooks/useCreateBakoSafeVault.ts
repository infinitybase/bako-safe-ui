import { useMutation } from '@tanstack/react-query';

import { createVault } from '../createVault';

const VAULT_QUERY_KEYS = {
  DEFAULT: ['bakosafe', 'vault'],
  VAULT: (id: string) => [...VAULT_QUERY_KEYS.DEFAULT, id],
};

interface UseCreateBakoSafeVaultOptions {
  onSuccess: (predicateAddress: string) => void;
  onError: () => void;
}

interface UseCreateBakoSafeVaultProps {
  token: string;
  userAddress: string;
  serverApi: string;
  options: UseCreateBakoSafeVaultOptions;
}

interface UseCreateBakoSafeVaultPayload {
  name: string;
  description: string;
  addresses: string[];
  minSigners: number;
  providerUrl: string;
}

const useCreateBakoSafeVault = ({
  options,
  serverApi,
  token,
  userAddress,
}: UseCreateBakoSafeVaultProps) => {
  const { mutate, ...mutation } = useMutation({
    mutationKey: VAULT_QUERY_KEYS.DEFAULT,
    mutationFn: async ({
      name,
      minSigners,
      addresses,
      providerUrl,
    }: UseCreateBakoSafeVaultPayload) => {
      try {
        const newVault = await createVault({
          name,
          minSigners,
          providerUrl,
          signers: addresses,
          token,
          userAddress,
          serverApi,
        });

        return newVault.predicateAddress;
      } catch (e) {
        console.log('[ERROR_ON_VAULT_CREATE]', e);
        throw e;
      }
    },
    ...options,
  });

  return {
    create: mutate,
    ...mutation,
  };
};

export { useCreateBakoSafeVault };
