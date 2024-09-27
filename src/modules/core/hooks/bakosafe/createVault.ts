import { BakoProvider, Vault, VaultConfigurable } from 'bakosafe';
import { Address } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { VaultService } from '@/modules/vault';

interface ICreateVaultPayload {
  minSigners: number;
  signers: string[];
}

const createVault = async ({ minSigners, signers }: ICreateVaultPayload) => {
  const providerUrl = import.meta.env.VITE_NETWORK;
  const userAddress = CookiesConfig.getCookie(CookieName.ADDRESS);
  const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);

  const configurable: VaultConfigurable = {
    SIGNATURES_COUNT: minSigners,
    SIGNERS: signers,
  };

  const vaultProvider = await BakoProvider.create(providerUrl, {
    address: userAddress,
    token,
  });

  const predicate = new Vault(vaultProvider, {
    ...configurable,
    HASH_PREDICATE: Address.fromRandom().toB256(),
  });

  const savedPredicate = await predicate.save();
  const vault = await VaultService.getByAddress(
    savedPredicate.predicateAddress,
  );

  return vault;
};

export { createVault };
