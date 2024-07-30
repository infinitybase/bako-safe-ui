import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const VAULT_LIST_QUERY_KEY = 'predicate/by-address';

const useUserVaultRequest = () => {
  const { account } = useWorkspaceContext();

  return useQuery({
    queryKey: [VAULT_LIST_QUERY_KEY, account],
    queryFn: () => VaultService.getAll(),
    refetchOnWindowFocus: false,
  });
};

export { useUserVaultRequest, VAULT_LIST_QUERY_KEY };
