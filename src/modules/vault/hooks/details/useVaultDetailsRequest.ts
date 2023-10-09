import { useQuery } from 'react-query';

import { BsafeProvider } from '@/modules/core';
import { VaultService } from '@/modules/vault/services';

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
    ['predicate/get', id],
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

export { useVaultDetailsRequest };
