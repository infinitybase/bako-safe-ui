import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../services';
import { ordinateMembers } from '../utils';

const VAULT_BY_ID_QUERY_KEY = 'vault/by-id';

const useVaultByIdRequest = (vaultId: string) => {
  const { data, ...query } = useQuery({
    queryKey: [VAULT_BY_ID_QUERY_KEY, vaultId],
    queryFn: () => VaultService.getById(vaultId),
    refetchOnWindowFocus: false,
    enabled: !!vaultId,
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });

  return {
    data: {
      ...data!,
      members: ordinateMembers(data?.members!, data?.owner!),
    },
    ...query,
  };
};

export { useVaultByIdRequest, VAULT_BY_ID_QUERY_KEY };
