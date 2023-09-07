import { Vault } from 'bsafe';
import { useQuery } from 'react-query';

import { VaultService } from '@/modules';

const getPredicateInstance = async (id: string) => {
  const predicate = await VaultService.getById(id);

  const params = JSON.parse(predicate.configurable);

  const _configurable = {
    minSigners: predicate.minSigners,
    addresses: predicate.addresses,
    network: predicate.network,
    ...params,
  };
  return {
    ...predicate,
    predicateInstance: await new Vault({
      abi: predicate.abi,
      configurable: _configurable,
      bytecode: predicate.bytes,
    }).getPredicate(),
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
