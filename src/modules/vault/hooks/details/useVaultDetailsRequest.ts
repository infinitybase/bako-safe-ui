import { useQuery } from 'react-query';

import { BsafeProvider } from '@/modules/core';
import { VaultService } from '@/modules/vault/services';

const VAULT_DETAIL_QUERY_KEY = 'vault/get';

const getPredicateInstance = async (id: string) => {
  const predicate = await VaultService.getById(id);

  const vault = BsafeProvider.instanceVault(predicate);

  return {
    ...predicate,
    predicateInstance: vault,
  };
};

function useVaultDetailsRequest(id: string) {
  const { data: predicate, ...rest } = useQuery(
    [VAULT_DETAIL_QUERY_KEY, id],
    () => getPredicateInstance(id),
    {
      enabled: !!id,
    },
  );

  return {
    ...rest,
    predicate,
  };
}

export { useVaultDetailsRequest, VAULT_DETAIL_QUERY_KEY };
