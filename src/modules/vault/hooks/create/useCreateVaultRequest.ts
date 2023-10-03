import { predicateABI, predicateBIN } from 'bsafe';
import { Provider } from 'fuels';
import { useMutation, UseMutationOptions } from 'react-query';

import { BsafeProvider } from '@/modules/core';

import {
  CreatePredicatePayload,
  CreatePredicateResponse,
  VaultService,
} from '../../services';

export interface CreatePredicateParams {
  name: string;
  description?: string;
  owner: string;
  addresses: string[];
  minSigners: number;
  provider: Provider;
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

  const createVault = async (params: CreatePredicateParams) => {
    const vault = await BsafeProvider.instanceNewVault({
      minSigners: params.minSigners,
      addresses: params.addresses,
      provider: params.provider,
    });

    return _createPredicate({
      name: params.name,
      predicateAddress: vault.address.toString(),
      description: params.description ?? '',
      minSigners: params.minSigners,
      addresses: params.addresses,
      owner: params.owner,
      bytes: predicateBIN,
      abi: JSON.stringify(predicateABI),
      configurable: JSON.stringify(vault.getConfigurable()),
      chainId: undefined,
      provider: vault.provider.url,
    });
  };

  return {
    createVault,
    ...rest,
  };
};

export { useCreateVaultRequest };
