import { useQuery } from 'react-query';

import { BsafeProvider } from '@/modules/core';
import { VaultService } from '@/modules/vault/services';

const getPredicateInstance = async (address: string) => {
  const predicate = await VaultService.getByAddress(address);

  const vault = BsafeProvider.instanceVault(predicate);

  return {
    ...predicate,
    predicateInstance: vault,
  };
};

function useVaultDetailsRequest(address: string) {
  const { data: predicate, ...rest } = useQuery(
    ['predicate/get', address],
    () => getPredicateInstance(address),
  );

  return {
    ...rest,
    predicate,
  };
}

export { useVaultDetailsRequest };
