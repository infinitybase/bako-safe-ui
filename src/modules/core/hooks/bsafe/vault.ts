import { IPayloadVault, Vault } from 'bsafe';

import { useBsafeMutation, useBsafeQuery } from './utils';

const VAULT_QUERY_KEYS = {
  DEFAULT: ['bsafe', 'vault'],
  VAULT: (id: string) => [...VAULT_QUERY_KEYS.DEFAULT, id],
};

const useBsafeVault = (id: string) => {
  const { data, ...rest } = useBsafeQuery(
    VAULT_QUERY_KEYS.VAULT(id),
    (context) => {
      return Vault.create({
        id,
        token: context.auth.token,
        address: context.auth.token,
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

const useCreateBsafeVault = (params?: UseCreateBsafeVaultParams) => {
  const { mutate, ...mutation } = useBsafeMutation<
    Vault,
    unknown,
    Omit<IPayloadVault, 'BSAFEAuth'>
  >(
    VAULT_QUERY_KEYS.DEFAULT,
    async ({ auth, ...params }) => {
      return Vault.create({
        ...params,
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
