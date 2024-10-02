import { PredicateResponseWithWorkspace } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { createVault } from './createVault';
import { instantiateVault } from './instantiateVault';
import { useBakoSafeMutation, useBakoSafeQuery } from './utils';

const VAULT_QUERY_KEYS = {
  DEFAULT: ['bakosafe', 'vault'],
  VAULT: (id: string) => [...VAULT_QUERY_KEYS.DEFAULT, id],
};

interface UseCreateBakoSafeVaultParams {
  onSuccess: (data: PredicateResponseWithWorkspace) => void;
  onError: () => void;
}

interface UseCreateBakoSafeVaultPayload {
  name: string;
  description: string;
  addresses: string[];
  minSigners: number;
}

interface IUseBakoSafeVault {
  provider: string;
  address: string;
  id: string;
}

const useBakoSafeVault = ({ address, id }: IUseBakoSafeVault) => {
  const { authDetails } = useWorkspaceContext();
  const query = useBakoSafeQuery(
    [...VAULT_QUERY_KEYS.VAULT(id), authDetails.userInfos.workspace?.id],
    async () => {
      const vault = await instantiateVault({
        predicateAddress: address,
      });
      return vault;
    },
    {
      enabled: !!id,
    },
  );

  return {
    vault: query.data,
    ...query,
  };
};

const useCreateBakoSafeVault = (params?: UseCreateBakoSafeVaultParams) => {
  const { mutate, ...mutation } = useBakoSafeMutation<
    PredicateResponseWithWorkspace,
    unknown,
    UseCreateBakoSafeVaultPayload
  >(
    VAULT_QUERY_KEYS.DEFAULT,
    async ({ name, minSigners, addresses }) => {
      try {
        const newVault = await createVault({
          name,
          minSigners,
          signers: addresses,
        });

        return newVault;
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
