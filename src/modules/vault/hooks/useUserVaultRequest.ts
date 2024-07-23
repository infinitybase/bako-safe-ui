import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth';

import { VaultService } from '../services';

const VAULT_LIST_QUERY_KEY = 'predicate/by-address';

const useUserVaultRequest = () => {
  const { account } = useAuthStore();

  return useQuery({
    queryKey: [VAULT_LIST_QUERY_KEY, account],
    queryFn: () => VaultService.getAll(),
    refetchOnWindowFocus: false,
  });
};

export { useUserVaultRequest, VAULT_LIST_QUERY_KEY };
