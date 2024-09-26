import { useQuery } from '@tanstack/react-query';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { VaultService } from '../services';

const VAULT_LIST_QUERY_KEY = 'predicate/by-user-address';

const useUserVaultRequest = () => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  return useQuery({
    queryKey: [VAULT_LIST_QUERY_KEY, userInfos.address],
    queryFn: () => VaultService.getAll(),
    refetchOnWindowFocus: false,
  });
};

export { useUserVaultRequest, VAULT_LIST_QUERY_KEY };
