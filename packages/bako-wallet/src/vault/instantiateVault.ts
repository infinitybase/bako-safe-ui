import { BakoProvider, Vault, VaultConfigurable } from 'bakosafe';
import { Provider } from 'fuels';

interface IInstantiateVaultProps {
  provider?: Provider;
  providerUrl: string;
  configurable?: string;
  predicateAddress?: string;
  serverApi: string;
  userAddress: string;
  token: string;
}

const instantiateVault = async ({
  provider,
  providerUrl,
  configurable,
  predicateAddress,
  serverApi,
  token,
  userAddress,
}: IInstantiateVaultProps) => {
  if (configurable && provider) {
    const vault = new Vault(
      provider,
      configurable as unknown as VaultConfigurable,
    );

    return vault;
  }

  const vaultProvider = await BakoProvider.create(providerUrl, {
    address: userAddress,
    token,
    serverApi,
  });

  return await Vault.fromAddress(predicateAddress ?? '', vaultProvider);
};

export { instantiateVault };
