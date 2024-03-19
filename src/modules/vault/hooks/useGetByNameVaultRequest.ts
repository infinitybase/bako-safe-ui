import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { VaultService } from '../services';

const VAULT_LIST_QUERY_KEY = 'predicate/by-name';

const useCheckVaultName = (name: string) => {
  const params = useParams<{ workspaceId: string }>();
  return useQuery(
    [VAULT_LIST_QUERY_KEY, name],
    () => VaultService.getByName(params.workspaceId!, name),
    {
      refetchOnWindowFocus: false,
    },
  );
};

export { useCheckVaultName };
