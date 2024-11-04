import { BakoProvider, Vault, VaultConfigurable } from 'bakosafe';
import { Address } from 'fuels';

interface ICreateVaultPayload {
  name?: string;
  signers: string[];
  minSigners: number;
  providerUrl: string;
  serverApi: string;
  userAddress: string;
  token: string;
}

const createVault = async ({
  name,
  signers,
  minSigners,
  providerUrl,
  serverApi,
  userAddress,
  token,
}: ICreateVaultPayload) => {
  const configurable: VaultConfigurable = {
    SIGNATURES_COUNT: minSigners,
    SIGNERS: signers,
  };

  const vaultProvider = await BakoProvider.create(providerUrl, {
    token,
    address: userAddress,
    serverApi,
  });

  const predicate = new Vault(vaultProvider, {
    ...configurable,
    HASH_PREDICATE: Address.fromRandom().toB256(),
  });

  return await predicate.save({ name });
};

export { createVault };
