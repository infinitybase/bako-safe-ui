import { Provider, Wallet } from 'fuels';

import { deployBakoSwap, deployProxy } from '@/utils/contracts';

const provider = new Provider('https://mainnet.fuel.network/v1/graphql');
const manager = Wallet.fromPrivateKey(process.env.PRIVATE_KEY!, provider);

const main = async () => {
  const proxy = await deployProxy({ account: manager, provider });

  const swap = await deployBakoSwap({ account: manager, provider });

  console.log('Setting proxy target to swap contract...');
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
