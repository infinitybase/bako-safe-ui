import { useQuery } from 'react-query';

import { BsafeVaultProvider } from '@/modules/core';
import { VaultService } from '@/modules/vault/services';

const getPredicateInstance = async (id: string) => {
  const predicate = await VaultService.getById(id);

  const vault = BsafeVaultProvider.instanceVault(predicate);

  return {
    ...predicate,
    predicateInstance: await vault.getPredicate(),
  };
};

function useVaultDetailsRequest(id: string) {
  const { data: predicate, ...rest } = useQuery(['predicate/get', id], () =>
    getPredicateInstance(id),
  );

  return {
    ...rest,
    predicate,
  };
}

export { useVaultDetailsRequest };
