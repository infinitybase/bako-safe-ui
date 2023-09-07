import { Vault } from 'bsafe';
import { useQuery } from 'react-query';

import { VaultService } from '@/modules';

const getPredicateInstance = async (id: string) => {
  try {
    const {
      abi,
      bytes,
      configurable,
      addresses,
      network,
      minSigners,
      // chainId,
      ...restPredicate
    } = await VaultService.getById(id);

    const params = JSON.parse(configurable);

    const _configurable = {
      minSigners,
      addresses,
      network,
      ...params,
    };
    return {
      ...restPredicate,
      minSigners,
      addresses,
      predicateInstance: await new Vault({
        abi,
        configurable: _configurable,
        bytecode: bytes,
      }).getPredicate(),
    };
  } catch (e) {
    console.log(e);
  }
};

function useVaultDetailsRequest(id?: string) {
  const { data: predicate, ...rest } = useQuery(['predicate/get', id], () =>
    id ? getPredicateInstance(id) : undefined,
  );

  return {
    ...rest,
    predicate,
  };
}

export { useVaultDetailsRequest };
