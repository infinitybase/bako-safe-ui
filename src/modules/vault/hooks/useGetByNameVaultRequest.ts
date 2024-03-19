import { useQuery } from 'react-query';

import { VaultService } from '../services';

const VAULT_LIST_QUERY_KEY = 'predicate/by-name';

const useCheckVaultName = (name: string) => {
  return useQuery(
    [VAULT_LIST_QUERY_KEY, name],
    () => VaultService.getByName(name),
    {
      refetchOnWindowFocus: false,
    },
  );
};

export { useCheckVaultName };
