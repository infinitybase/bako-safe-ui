import BTCIcon from '@/assets/tokens/bitcoin.svg';
import UNIIcon from '@/assets/tokens/uniswap.svg';
import USDCIcon from '@/assets/tokens/usdc.svg';

import { Asset, AssetMap } from './types';
import { tokensIDS } from './address';
const ETHDefault = 'https://cdn.fuel.network/assets/eth.svg';
const NativeAssetId =
  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07';

const assetsList: Asset[] = [
  {
    name: 'Ethereum',
    slug: 'ETH',
    assetId: NativeAssetId,
    icon: ETHDefault,
  },
  {
    name: 'Bitcoin',
    slug: 'BTC',
    assetId: tokensIDS['BTC'],
    icon: BTCIcon,
  },
  {
    name: 'USDC',
    slug: 'USDC',
    assetId: tokensIDS['USDC'],
    icon: USDCIcon,
  },
  {
    name: 'Uniswap',
    slug: 'UNI',
    assetId: tokensIDS['UNI'],
    icon: UNIIcon,
  },
  {
    name: 'Dai',
    slug: 'DAI',
    assetId: tokensIDS['DAI'],
    icon: ETHDefault,
  },
  {
    name: 'sEther',
    slug: 'sETH',
    assetId: tokensIDS['sETH'],
    icon: ETHDefault,
  },
];

const assetsMap: AssetMap = assetsList.reduce((previousValue, currentValue) => {
  return {
    ...previousValue,
    [currentValue.assetId]: {
      name: currentValue.name,
      slug: currentValue.slug,
      icon: currentValue.icon,
    },
  };
}, {});

export { assetsList, assetsMap, ETHDefault, NativeAssetId };
