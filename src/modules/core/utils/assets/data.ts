import {
  BitcoinIcon,
  EthereumIcon,
  UniswapIcon,
  UnknownIcon,
  UsdcIcon,
} from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';

import { tokensIDS } from './address';
import { Asset, AssetMap } from './types';
const ETHDefault = 'https://cdn.fuel.network/assets/eth.svg';
const NativeAssetId =
  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07';

const assetsList: Asset[] = [
  {
    name: 'Ethereum',
    slug: 'ETH',
    assetId: NativeAssetId,
    icon: EthereumIcon,
  },
  {
    name: 'Bitcoin',
    slug: 'BTC',
    assetId: tokensIDS['BTC'],
    icon: BitcoinIcon,
  },
  {
    name: 'USDC',
    slug: 'USDC',
    assetId: tokensIDS['USDC'],
    icon: UsdcIcon,
  },
  {
    name: 'Uniswap',
    slug: 'UNI',
    assetId: tokensIDS['UNI'],
    icon: UniswapIcon,
  },
  {
    name: 'Dai',
    slug: 'DAI',
    assetId: tokensIDS['DAI'],
    icon: EthereumIcon,
  },
  {
    name: 'sEther',
    slug: 'sETH',
    assetId: tokensIDS['sETH'],
    icon: EthereumIcon,
  },
  {
    name: 'Unknown',
    slug: 'UNK',
    assetId: 'UNKNOWN',
    icon: UnknownIcon,
  },
  {
    name: 'BAKO',
    slug: 'BAKO',
    assetId: tokensIDS['BAKO'],
    icon: BakoIcon,
  },
];

const assetsMap: AssetMap = assetsList.reduce((previousValue, currentValue) => {
  return {
    ...previousValue,
    [currentValue.assetId]: {
      name: currentValue.name,
      slug: currentValue.slug,
      icon: currentValue.icon,
      assetId: currentValue.assetId,
    },
  };
}, {});

export { assetsList, assetsMap, ETHDefault, NativeAssetId };
