import { Assets, assets } from 'fuels';

import { localStorageKeys } from '@/modules/auth/services';
import { availableNetWorks, NetworkType } from '@/modules/network/services';

import { Asset, AssetMap } from './types';

const ETHDefault = 'https://cdn.fuel.network/assets/eth.svg';
const NativeAssetId =
  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07';
export const FUEL_ASSET_ID =
  '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82';
export const FUEL_TESTNET_ASSET_ID =
  '0x324d0c35a4299ef88138a656d5272c5a3a9ccde2630ae055dacaf9d13443d53b';

export const UNKNOWN_ASSET_UNITS = 9;

export const UNKNOWN_ASSET = {
  name: 'Unknown',
  slug: 'UNK',
  assetId: 'UNKNOWN',
  icon: '/tokens/unknown.svg',
  units: UNKNOWN_ASSET_UNITS,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getFuelTokensList = () => {
  const atual = window.localStorage.getItem(
    localStorageKeys.FUEL_MAPPED_TOKENS,
  );
  const atualObj: Assets = JSON.parse(atual || '{}');

  const result = [...Object.values(atualObj).map((item) => item), ...assets];
  return result;
};

export const getChainId = (): number =>
  Number(
    localStorage.getItem(localStorageKeys.SELECTED_CHAIN_ID) ??
      availableNetWorks[NetworkType.TESTNET].chainId,
  );

export const formatedAssets = (assetsList: Assets, chainId: number): Asset[] =>
  assetsList
    .reduce<Asset[]>((acc, asset) => {
      const network =
        asset?.networks?.find(
          (network) => network && network.chainId === chainId,
        ) ?? null;
      if (!network && asset?.name && asset?.symbol && asset) {
        acc.push({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          name: asset.name,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          slug: asset.symbol,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          assetId: asset.assetId,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          icon: asset?.metadata?.URI ?? UNKNOWN_ASSET.icon,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          units: asset.decimals,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          metadata: asset.metadata,
        });
      } else if (network && network.type === 'fuel') {
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

// @todo: remove this
const assetsList: Asset[] = formatedAssets([], getChainId());

export const assetsMapFromFormattedFn = (
  tokenList: Assets = [],
  chainId: number,
): AssetMap => {
  const assets = formatedAssets(tokenList, chainId);
  const assetsMap: AssetMap = assets.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.assetId]: {
        name: currentValue?.name,
        slug: currentValue?.slug,
        icon: currentValue?.icon,
        assetId: currentValue?.assetId,
        units: currentValue?.units,
        metadata: currentValue?.metadata,
      },
    };
  }, {});

  return assetsMap;
};

const getAssetInfo = (assetsMap: AssetMap, assetId: string) =>
  assetsMap[assetId] ?? assetsMap['UNKNOWN'];

export { assetsList, ETHDefault, getAssetInfo, NativeAssetId };
