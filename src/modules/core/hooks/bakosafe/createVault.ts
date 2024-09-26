import { BakoProvider, Vault, VaultConfigurable } from 'bakosafe';
import { Address } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { VaultService } from '@/modules/vault';

interface ICreateVaultPayload {
  minSigners: number;
  signers: string[];
}

const createVault = async ({ minSigners, signers }: ICreateVaultPayload) => {
  // Vault não aceita name. Na SDK, por padrão ele usa o predicateAddress 256

  const providerUrl = CookiesConfig.getCookie(CookieName.PROVIDER_URL);
  const userAddress = CookiesConfig.getCookie(CookieName.ADDRESS);
  const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);

  const configurable: VaultConfigurable = {
    SIGNATURES_COUNT: minSigners,
    SIGNERS: signers,
  };

  const challenge = await BakoProvider.setup({
    address: userAddress,
    provider: providerUrl,
  });

  console.log('challenge:', challenge);

  const vaultProvider = await BakoProvider.authenticate(providerUrl, {
    address: userAddress,
    challenge,
    // challenge:
    //   'code0xf352b2a05182558b22b1914247673b65d76491780f48630f3e871e8bd56cc4ff',

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
