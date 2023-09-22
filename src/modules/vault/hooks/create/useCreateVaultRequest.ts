import { predicateABI, predicateBIN } from 'bsafe';
import { useMutation, UseMutationOptions } from 'react-query';

import { BsafeVaultProvider } from '@/modules/core';

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
    const vault = BsafeVaultProvider.instanceNewVault({
      minSigners: params.minSigners,
      addresses: params.addresses,
    });

    return _createPredicate({
      name: params.name,
      predicateAddress: (await vault.getPredicate()).address.toString(),
      description: params.description ?? '',
      minSigners: params.minSigners,
      addresses: params.addresses,
      owner: params.owner,
      bytes: predicateBIN,
      abi: JSON.stringify(predicateABI),
      configurable: JSON.stringify(vault.configurable),
      chainId: undefined,
      provider: vault.getNetwork(),
    });
  };

  return {
    createVault,
    ...rest,
  };
};

export { useCreateVaultRequest };
