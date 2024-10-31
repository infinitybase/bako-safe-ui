import {
  IVaultConfigurable,
  PredicateAndWorkspace,
} from '@bako-safe/services/modules/vault';
import { useQuery } from '@tanstack/react-query';

import { vaultService } from '@/modules/services/services-initializer';

import { ordinateMembers } from '../utils';

const VAULT_BY_ID_QUERY_KEY = 'vault/by-id';

const parsedConfigurable = (configurable?: string): IVaultConfigurable => {
  return configurable
    ? JSON.parse(configurable)
    : { SIGNATURES_COUNT: 0, SIGNERS: [], HASH_PREDICATE: '' };
};

const useVaultByIdRequest = (vaultId: string) => {
  const { data, ...query } = useQuery<PredicateAndWorkspace>({
    queryKey: [VAULT_BY_ID_QUERY_KEY, vaultId],
    queryFn: async (): Promise<PredicateAndWorkspace> => {
      const response = await vaultService.getById(vaultId);

      return {
        ...response,
        configurable: parsedConfigurable(response.configurable),
        members: ordinateMembers(response.members, response.owner),
      };
    },
    refetchOnWindowFocus: false,
    enabled: !!vaultId,
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });

  return {
    data: {
      ...data!,
    },
    ...query,
  };
};

export { useVaultByIdRequest, VAULT_BY_ID_QUERY_KEY };
