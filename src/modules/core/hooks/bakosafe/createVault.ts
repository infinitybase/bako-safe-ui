import { BakoProvider, Vault, VaultConfigurable } from 'bakosafe';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { VaultService } from '@/modules/vault';

interface ICreateVaultPayload {
  name?: string;
  signers: string[];
  minSigners: number;
  providerUrl: string;
  description?: string;
}

const createVault = async ({
  name,
  signers,
  minSigners,
  providerUrl,
  description,
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
  });

  const savedPredicate = await predicate.save({ name, description });
  const vault = await VaultService.getByAddress(
    savedPredicate.predicateAddress,
  );

  return vault;
};

export { createVault };
