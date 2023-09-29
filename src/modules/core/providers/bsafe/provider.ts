import { IConfVault, Vault } from 'bsafe';
import { bn, Provider } from 'fuels';

import { AssetModel, Predicate, VaultUtils } from '@/modules/core';

export interface InstanceTransactionParams {
  predicate: Vault;
  assets: AssetModel[];
  witnesses: string[];
}

export interface InstanceNewVaultParams {
  addresses: string[];
  minSigners: number;
  provider: Provider;
}

export type InstanceVaultParams = Predicate;

class BsafeProvider {
  static async instanceNewVault(params: InstanceNewVaultParams) {
    const chainId = await params.provider.getChainId();

    const configurable: IConfVault = {
      chainId,
      network: params.provider.url,
      SIGNATURES_COUNT: params.minSigners,
      SIGNERS: VaultUtils.makeSubscribers(params.addresses),
      HASH_PREDUCATE: VaultUtils.makeHashPredicate(),
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

  static async instanceTransaction(params: InstanceTransactionParams) {
    const { witnesses, assets, predicate } = params;

    const transaction = await predicate.includeTransaction(
      assets.map((asset) => ({
        assetId: asset.assetID,
        amount: bn(bn.parseUnits(asset.amount)).format(),
        to: asset.to,
      })),
      witnesses,
    );

    return transaction;
  }
}

export { BsafeProvider };
