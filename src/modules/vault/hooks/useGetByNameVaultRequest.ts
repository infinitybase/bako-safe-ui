import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../services';

const VAULT_LIST_QUERY_KEY = 'predicate/by-name';

const useCheckVaultName = (name: string, ignoreId?: string) => {
  return useQuery({
    queryKey: [VAULT_LIST_QUERY_KEY, name],
    queryFn: () => VaultService.getByName(name, ignoreId),
    refetchOnWindowFocus: false,
    enabled: !!name && name.length > 0,
  });
};

export { useCheckVaultName };
