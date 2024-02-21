import { useFuel } from '@fuels/react';
import { Vault } from 'bsafe';
import { Provider } from 'fuels';

import { useBsafeMutation, useBsafeQuery } from './utils';

const VAULT_QUERY_KEYS = {
  DEFAULT: ['bsafe', 'vault'],
  VAULT: (id: string) => [...VAULT_QUERY_KEYS.DEFAULT, id],
};

const useBsafeVault = (id: string) => {
  const { data, ...rest } = useBsafeQuery(
    VAULT_QUERY_KEYS.VAULT(id),
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
  const { fuel } = useFuel();

  const { mutate, ...mutation } = useBsafeMutation<
    Vault,
    unknown,
    UseCreateBsafeVaultPayload
  >(
    VAULT_QUERY_KEYS.DEFAULT,
    async ({ auth, ...params }) => {
      const netowrk = await fuel.currentNetwork();
      const provider = await Provider.create(netowrk.url);

      return Vault.create({
        name: params.name,
        description: params.description!,
        // @ts-ignore
        provider: provider,
        configurable: {
          chainId: provider.getChainId(),
          network: provider.url,
          SIGNATURES_COUNT: params.minSigners,
          SIGNERS: params.addresses,
        },
        BSAFEAuth: auth,
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
