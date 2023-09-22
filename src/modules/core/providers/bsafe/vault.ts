import { Vault } from 'bsafe';

import { Predicate } from '@/modules/core';

import { VaultUtils } from './utils.ts';

export interface InstanceNewVaultParams {
  addresses: string[];
  minSigners: number;
}

export type InstanceVaultParams = Predicate;

class BsafeVaultProvider {
  static instanceNewVault(params: InstanceNewVaultParams) {
    const configurable = {
      SIGNATURES_COUNT: params.minSigners.toString(),
      SIGNERS: VaultUtils.makeSubscribers(params.addresses),
      HASH_PREDUCATE: VaultUtils.makeHashPredicate(),
      addresses: params.addresses,
      minSigners: params.minSigners,
    };

    return new Vault({ configurable });
  }
  static instanceVault(params: InstanceVaultParams) {
    const configurable = JSON.parse(params.configurable);

    return new Vault({
      abi: params.abi,
      configurable: {
        minSigners: params.minSigners,
        addresses: params.addresses,
        network: params.provider,
        ...configurable,
      },
      bytecode: params.bytes,
    });
  }
}

export { BsafeVaultProvider };
