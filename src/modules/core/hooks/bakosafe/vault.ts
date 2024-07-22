import { BakoSafe, IPayloadVault, Vault } from 'bakosafe';

import { useAuth } from '@/modules/auth';

import { useBakoSafeMutation, useBakoSafeQuery } from './utils';
import { ordinateMembers } from '@/modules/vault/utils';

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
    {
      enabled: !!id,
      onSuccess: (data) => {
        // ordinate vault members
        const {
          BakoSafeVault: { members, owner },
        } = data;

        data.BakoSafeVault.members = ordinateMembers(members, owner);
        return data;
      },
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
      try {
        const { provider } = await hasWallet();
        const vault: IPayloadVault = {
          name: params.name,
          description: params.description!,
          configurable: {
            network: provider.url ?? BakoSafe.getProviders('CHAIN_URL'),
            SIGNATURES_COUNT: params.minSigners,
            SIGNERS: params.addresses,
          },
          BakoSafeAuth: auth,
        };

        return await Vault.create(vault);
      } catch (e) {
        console.log('[ERROR_ON_VAULT_CREATE]', e);
        throw e;
      }
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
