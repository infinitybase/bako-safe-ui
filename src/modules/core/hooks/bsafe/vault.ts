import { Vault } from 'bakosafe';

import { useAuth } from '@/modules/auth';

import { useBsafeMutation, useBsafeQuery } from './utils';

const VAULT_QUERY_KEYS = {
  DEFAULT: ['bakosafe', 'vault'],
  VAULT: (id: string) => [...VAULT_QUERY_KEYS.DEFAULT, id],
};

const useBsafeVault = (id: string) => {
  const auth = useAuth();

  const { data, ...rest } = useBsafeQuery(
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

interface UseCreateBsafeVaultParams {
  onSuccess: (data: Vault) => void;
  onError: () => void;
}

interface UseCreateBsafeVaultPayload {
  name: string;
  description: string;
  addresses: string[];
  minSigners: number;
}

const useCreateBsafeVault = (params?: UseCreateBsafeVaultParams) => {
  const { hasWallet } = useAuth();

  const { mutate, ...mutation } = useBsafeMutation<
    Vault,
    unknown,
    UseCreateBsafeVaultPayload
  >(
    VAULT_QUERY_KEYS.DEFAULT,
    async ({ auth, ...params }) => {
      const { provider } = await hasWallet();

      return Vault.create({
        name: params.name,
        description: params.description!,
        provider: provider,
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

export { useBsafeVault, useCreateBsafeVault };
