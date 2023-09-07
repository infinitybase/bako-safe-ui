import { predicateABI, predicateBIN, Vault } from 'bsafe';
import { useMutation, UseMutationOptions } from 'react-query';

import {
  CreatePredicatePayload,
  CreatePredicateResponse,
  VaultService,
} from '../../services';
import { VaultUtils } from '../../utils';

const { VITE_NETWORK = 'https://beta-4.fuel.network/graphql' } = import.meta
  .env;

export interface CreatePredicateParams {
  name: string;
  description?: string;
  owner: string;
  addresses: string[];
  minSigners: number;
}

const useCreateVaultRequest = (
  options?: UseMutationOptions<
    CreatePredicateResponse,
    unknown,
    CreatePredicatePayload
  >,
) => {
  const { mutateAsync: _createPredicate, ...rest } = useMutation(
    'predicate/create',
    VaultService.create,
    options,
  );

  const instanceNewPredicate = async (
    addresses: string[],
    minSigners: number,
  ) => {
    const configurable = {
      SIGNATURES_COUNT: minSigners.toString(),
      SIGNERS: VaultUtils.makeSubscribers(addresses),
      HASH_PREDUCATE: VaultUtils.makeHashPredicate(),
      addresses: addresses,
      minSigners: minSigners,
    };

    return new Vault({ configurable });
  };

  const createVault = async (params: CreatePredicateParams) => {
    const predicate = await instanceNewPredicate(
      params.addresses,
      params.minSigners,
    );

    return _createPredicate({
      name: params.name,
      address: (await predicate.getPredicate()).address.toString(),
      description: params.description,
      minSigners: params.minSigners,
      addresses: params.addresses,
      owner: params.owner,
      bytes: predicateBIN,
      abi: JSON.stringify(predicateABI),
      configurable: JSON.stringify(predicate.configurable),
      network: VITE_NETWORK,
    });
  };

  return {
    createVault,
    ...rest,
  };
};

export { useCreateVaultRequest };
