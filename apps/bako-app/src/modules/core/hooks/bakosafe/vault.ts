import { PredicateResponseWithWorkspace } from '@bako-safe/services/modules/vault';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Network } from 'fuels';

import { createVault } from './createVault';
import { instantiateVault } from './instantiateVault';

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
  providerUrl: string;
}

interface IUseBakoSafeGetVault {
  predicateAddress: string;
  id: string;
  workspaceId: string;
  network: Network;
}

const useBakoSafeGetVault = ({
  predicateAddress,
  id,
  workspaceId,
  network,
}: IUseBakoSafeGetVault) => {
  const query = useQuery({
    queryKey: [...VAULT_QUERY_KEYS.VAULT(id), workspaceId, network],
    queryFn: () => {
      const vault = instantiateVault({
        predicateAddress,
        providerUrl: network.url,
      });
      return vault;
    },
    enabled: !!id,
  });

  return {
    vault: query.data,
    ...query,
  };
};

const useCreateBakoSafeVault = (params?: UseCreateBakoSafeVaultParams) => {
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
        });

        return newVault;
      } catch (e) {
        console.log('[ERROR_ON_VAULT_CREATE]', e);
        throw e;
      }
    },
    onError: params?.onError,
    onSuccess: params?.onSuccess,
  });

  return {
    create: mutate,
    ...mutation,
  };
};

export { useBakoSafeGetVault, useCreateBakoSafeVault };
