import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../services';

const VAULT_BY_ID_QUERY_KEY = 'vault/by-id';

const useVaultByIdRequest = (vaultId: string) => {
  return useQuery({
    queryKey: [VAULT_BY_ID_QUERY_KEY, vaultId],
    queryFn: () => VaultService.getById(vaultId),
    refetchOnWindowFocus: false,
    enabled: !!vaultId,
  });
};

export { useVaultByIdRequest, VAULT_BY_ID_QUERY_KEY };
