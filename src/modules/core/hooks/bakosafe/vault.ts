import { Vault } from 'bakosafe';

import { useAuth } from '@/modules/auth';

import { useBakoSafeMutation, useBakoSafeQuery } from './utils';

const VAULT_QUERY_KEYS = {
  DEFAULT: ['bakosafe', 'vault'],
  VAULT: (id: string) => [...VAULT_QUERY_KEYS.DEFAULT, id],
};

const useBakoSafeVault = (id: string) => {
  const auth = useAuth();

  const { data, ...rest } = useBakoSafeQuery(
    [...VAULT_QUERY_KEYS.VAULT(id), auth.workspaces.current],
    async (context) => {
      return await Vault.create({
        id,
        token: context.auth.token,
        address: context.auth.address,
      });
    },
  );
  return {
    vault: data,
    ...rest,
  };
};

interface UseCreateBakoSafeVaultParams {
  onSuccess: (data: Vault) => void;
  onError: () => void;
}

interface UseCreateBakoSafeVaultPayload {
  name: string;
  description: string;
  addresses: string[];
  minSigners: number;
}

const useCreateBakoSafeVault = (params?: UseCreateBakoSafeVaultParams) => {
  const { hasWallet } = useAuth();

  const { mutate, ...mutation } = useBakoSafeMutation<
    Vault,
    unknown,
    UseCreateBakoSafeVaultPayload
  >(
    VAULT_QUERY_KEYS.DEFAULT,
    async ({ auth, ...params }) => {
      const { provider } = await hasWallet();

      return Vault.create({
        name: params.name,
        description: params.description!,
        configurable: {
          chainId: provider.getChainId(),
          network: provider.url,
          SIGNATURES_COUNT: params.minSigners,
          SIGNERS: params.addresses,
        },
        BakoSafeAuth: auth,
      });
    },
    {
      onError: params?.onError,
      onSuccess: params?.onSuccess,
    },
  );

  return {
    create: mutate,
    ...mutation,
  };
};

export { useBakoSafeVault, useCreateBakoSafeVault };
