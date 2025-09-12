import fs from 'fs';
import {
  Account,
  Provider,
  Src14OwnedProxy,
  Src14OwnedProxyFactory,
  ZeroBytes32,
} from 'fuels';
import { contractIdInput } from 'mira-dex-ts/dist/sdk/utils';
import path from 'path';

import {
  DEFAULT_AMM_CONTRACT_ID,
  TESTNET_AMM_CONTRACT_ID,
} from '@/modules/core/utils/bako-amm';

import { SwapFactory } from '../../sway/artifacts';
import contracts from '../../sway/artifacts/contract-ids.json';

interface Config {
  owner: Account;
  deployer: Account;
  provider: Provider;
}

const setContractAddress = (name: string, chainId: number, address: string) => {
  const contractPath = path.join(
    path.join(__dirname, '..', '..', 'sway', 'artifacts'),
    'contract-ids.json',
  );
  const contracts = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  contracts[chainId.toString()] = contracts[chainId.toString()] || {};
  contracts[chainId.toString()][name] = address;
  fs.writeFileSync(contractPath, JSON.stringify(contracts, null, 2));
};

const getProxyAddress = (chainId: number, name: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - contracts is a JSON object with chain IDs as keys
  const contract = contracts[chainId.toString()];
  return contract?.[name];
};

export const deployProxy = async ({ deployer, owner, provider }: Config) => {
  const addr = getProxyAddress(await provider.getChainId(), 'bakoSwap');

  if (addr) {
    console.log(`Using existing proxy address: ${addr}`);
    return new Src14OwnedProxy(addr, deployer);
  }

  console.log('Deploying new proxy...');
  const proxy = await Src14OwnedProxyFactory.deploy(deployer, {
    configurableConstants: {
      INITIAL_TARGET: { bits: ZeroBytes32 },
      INITIAL_OWNER: {
        Initialized: { Address: { bits: owner.address.toB256() } },
      },
    },
  });

  const { contract } = await proxy.waitForResult();

  console.log('Initializing proxy');
  (await contract.functions.initialize_proxy().call()).waitForResult();

  setContractAddress(
    'bakoSwap',
    await provider.getChainId(),
    contract.id.toB256(),
  );

  console.log('Proxy deployed at:', contract.id.toB256());

  return contract;
};

export const deployBakoSwap = async ({ deployer, owner, provider }: Config) => {
  const chainId = await provider.getChainId();
  const ammId =
    chainId === 0 ? TESTNET_AMM_CONTRACT_ID : DEFAULT_AMM_CONTRACT_ID;
  const bakoSwapDeployed = await SwapFactory.deploy(deployer, {
    configurableConstants: {
      BAKO_FEE: 1, // 1% fee
      INITIAL_OWNER: { Address: { bits: owner.address.toB256() } },
      AMM_CONTRACT_ID: contractIdInput(ammId),
    },
  });

  const { contract } = await bakoSwapDeployed.waitForResult();

  console.log('BakoSwap contract deployed at:', contract.id.toB256());

  return contract;
};
