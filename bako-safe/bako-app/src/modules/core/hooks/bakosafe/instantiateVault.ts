import { BakoProvider, Vault, VaultConfigurable } from 'bakosafe';
import { Provider } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';

interface IInstantiateVaultProps {
  provider?: Provider;
  providerUrl: string;
  configurable?: string;
  predicateAddress?: string;
}

const instantiateVault = async ({
  provider,
  providerUrl,
  configurable,
  predicateAddress,
}: IInstantiateVaultProps) => {
  if (configurable && provider) {
    const vault = new Vault(
      provider,
      configurable as unknown as VaultConfigurable,
    );

    return vault;
  }

  const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);
  const userAddress = CookiesConfig.getCookie(CookieName.ADDRESS);

  const vaultProvider = await BakoProvider.create(providerUrl, {
    address: userAddress,
    token,
    serverApi: import.meta.env.VITE_API_URL,
  });

  return await Vault.fromAddress(predicateAddress ?? '', vaultProvider);
};

export { instantiateVault };
