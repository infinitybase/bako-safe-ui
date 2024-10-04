import { Assets, assets } from 'fuels';

import { localStorageKeys } from '@/modules/auth/services';

import { Asset, AssetMap } from './types';
const ETHDefault = 'https://cdn.fuel.network/assets/eth.svg';
const NativeAssetId =
  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07';

export const UNKNOWN_ASSET = {
  name: 'Unknown',
  slug: 'UNK',
  assetId: 'UNKNOWN',
  icon: '/src/assets/tokens/unknown.svg',
  units: 18,
};

const getChainId = (): number =>
  Number(
    localStorage.getItem(localStorageKeys.CHAIN_ID) ??
      import.meta.env.VITE_CHAIN_ID,
  );

export const formatedAssets = (chainId: number): Asset[] =>
  assets
    .reduce<Asset[]>((acc, asset) => {
      const network = asset.networks.find(
        (network) => network && network.chainId === chainId,
      );
      if (network && network.type === 'fuel') {
        acc.push({
          name: asset.name,
          slug: asset.symbol,
          assetId: network.assetId,
          icon: asset.icon,
          units: network.decimals,
        });
      }
      return acc;
    }, [])
    .concat(UNKNOWN_ASSET);

const assetsList: Asset[] = formatedAssets(getChainId());

export const assetsMapFromFormattedFn = (tokenList: Assets = []): AssetMap => {
  const list = tokenList
    ?.reduce<Asset[]>((acc, asset) => {
      const network = asset.networks.find(
        (network) => network && network.chainId === getChainId(),
      );
      if (network && network.type === 'fuel') {
        acc.push({
          name: asset.name,
          slug: asset.symbol,
          assetId: network.assetId,
          icon: asset.icon,
          units: network.decimals,
        });
      }
      return acc;
    }, [])
    .concat(UNKNOWN_ASSET);

  const assetsMap: AssetMap = list.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.assetId]: {
        name: currentValue.name,
        slug: currentValue.slug,
        icon: currentValue.icon,
        assetId: currentValue.assetId,
        units: currentValue.units,
      },
    };
  }, {});

  return assetsMap;
};

export { assetsList, ETHDefault, NativeAssetId };
