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

  const providerUrl = import.meta.env.VITE_NETWORK;
  const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);
  const userAddress = CookiesConfig.getCookie(CookieName.ADDRESS);

  const vaultProvider = await BakoProvider.create(providerUrl, {
    address: userAddress,
    token,
  });

  return await Vault.fromAddress(predicateAddress ?? '', vaultProvider);
};

export { instantiateVault };
