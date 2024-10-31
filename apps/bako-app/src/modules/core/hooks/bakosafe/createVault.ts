import { BakoProvider, Vault, VaultConfigurable } from 'bakosafe';
import { Address } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { vaultService } from '@/modules/services/services-initializer';

interface ICreateVaultPayload {
  name?: string;
  signers: string[];
  minSigners: number;
  providerUrl: string;
}

const createVault = async ({
  name,
  signers,
  minSigners,
  providerUrl,
}: ICreateVaultPayload) => {
  const userAddress = CookiesConfig.getCookie(CookieName.ADDRESS);
  const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);

  const configurable: VaultConfigurable = {
    SIGNATURES_COUNT: minSigners,
    SIGNERS: signers,
  };

  const vaultProvider = await BakoProvider.create(providerUrl, {
    token,
    address: userAddress,
    serverApi: import.meta.env.VITE_API_URL,
  });

  const predicate = new Vault(vaultProvider, {
    ...configurable,
    HASH_PREDICATE: Address.fromRandom().toB256(),
  });

  const savedPredicate = await predicate.save({ name });
  const vault = await vaultService.getByAddress(
    savedPredicate.predicateAddress,
  );

  return vault;
};

export { createVault };
