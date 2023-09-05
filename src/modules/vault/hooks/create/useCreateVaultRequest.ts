import { predicateABI, predicateBIN, Vault } from 'bsafe';
import { Provider } from 'fuels';
import { useMutation, UseMutationOptions } from 'react-query';

import {
  CreatePredicatePayload,
  CreatePredicateResponse,
  VaultService,
} from '../../services';

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
    const provider = new Provider(VITE_NETWORK);
    const predicate = new Vault({
      configurable: {
        minSigners,
        addresses,
        network: provider.url,
        chainId: await provider.getChainId(),
        SIGNATURES_COUNT: minSigners.toString(),
        SIGNERS: addresses,
        HASH_PREDUCATE: undefined,
      },
    });

    return predicate;
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
