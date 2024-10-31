import { useQuery } from '@tanstack/react-query';

import { vaultService } from '@/config/services-initializer';

const VAULT_LIST_QUERY_KEY = 'predicate/by-name';

const useCheckVaultName = (name: string) => {
  return useQuery({
    queryKey: [VAULT_LIST_QUERY_KEY, name],
    queryFn: () => vaultService.getByName(name),
    refetchOnWindowFocus: false,
    enabled: !!name && name.length > 0,
  });
};

export { useCheckVaultName };
