import { BakoSafe, IPayloadVault, Vault } from 'bakosafe';

import { useBakoSafeMutation, useBakoSafeQuery } from './utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const VAULT_QUERY_KEYS = {
  DEFAULT: ['bakosafe', 'vault'],
  VAULT: (id: string) => [...VAULT_QUERY_KEYS.DEFAULT, id],
};

const useBakoSafeVault = (id: string) => {
  const { authDetails } = useWorkspaceContext();
  const { data, ...rest } = useBakoSafeQuery(
    [...VAULT_QUERY_KEYS.VAULT(id), authDetails.userInfos.workspace?.id],
    async (context) => {
      return await Vault.create({
        id,
        token: context.auth.token,
        address: context.auth.address,
      });
    },
    {
      enabled: !!id,
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
  // const {
  //   authDetails: { userProvider },
  // } = useWorkspaceContext();

  const { mutate, ...mutation } = useBakoSafeMutation<
    Vault,
    unknown,
    UseCreateBakoSafeVaultPayload
  >(
    VAULT_QUERY_KEYS.DEFAULT,
    async ({ auth, ...params }) => {
      try {
        // const { provider } = await userProvider();
        const vault: IPayloadVault = {
          name: params.name,
          description: params.description!,
          configurable: {
            network: BakoSafe.getProviders('CHAIN_URL'),
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
