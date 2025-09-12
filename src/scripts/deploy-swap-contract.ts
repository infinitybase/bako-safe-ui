import { BakoProvider, Vault } from 'bakosafe';
import { Provider, Wallet } from 'fuels';

import { deployBakoSwap, deployProxy } from '@/utils/contracts';

const provider = new Provider('https://mainnet.fuel.network/v1/graphql');
const deployer = Wallet.fromPrivateKey(process.env.PRIVATE_KEY!, provider);

const main = async () => {
  const bakoProvider = await BakoProvider.create(provider.url, {
    apiToken: process.env.OWNER_API_TOKEN!,
  });
  const owner = new Vault(bakoProvider);

  const proxy = await deployProxy({ deployer, owner, provider });

  const swap = await deployBakoSwap({ deployer, owner, provider });

  console.log('Setting proxy target to swap contract...');
  proxy.account = owner;
  await (
    await proxy.functions.set_proxy_target({ bits: swap.id.toB256() }).call()
  ).waitForResult();
  console.log('Proxy target setted');
};

main()
  .then(() => console.log('Deployment completed successfully'))
  .catch((error) => {
    console.error('Error during deployment:', error);
    process.exit(1);
  });
