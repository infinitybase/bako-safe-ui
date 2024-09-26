import { BakoProvider, Vault, VaultConfigurable } from 'bakosafe';
import { Provider } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';

interface IInstantiateVaultProps {
  predicateAddress?: string;
  provider?: Provider;
  configurable?: string;
}

const instantiateVault = async ({
  predicateAddress,
  configurable,
  provider,
}: IInstantiateVaultProps) => {
  if (configurable && provider) {
    const vault = new Vault(
      provider,
      configurable as unknown as VaultConfigurable,
    );

    return vault;
  }

  const providerUrl = CookiesConfig.getCookie(CookieName.PROVIDER_URL);
  const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);
  const userAddress = CookiesConfig.getCookie(CookieName.ADDRESS);

  const challenge = await BakoProvider.setup({
    address: userAddress,
    provider: providerUrl,
  });

  const vaultProvider = await BakoProvider.authenticate(providerUrl, {
    address: userAddress,
    // I was using this with static value
    challenge,
    token: token,
  });

  return await Vault.fromAddress(predicateAddress ?? '', vaultProvider);
};

export { instantiateVault };
