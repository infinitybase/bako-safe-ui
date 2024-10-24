import { Asset, AssetMap } from '../utils';

const useSortTokenInfosArray = (
  assets: Asset[],
  assetsMap: false | AssetMap | undefined,
) => {
  const unknownAssetName = assetsMap?.['UNKNOWN'].name;

  const sortedAssets = assets.sort((a, b) => {
    if (a.name === unknownAssetName && b.name !== unknownAssetName) {
      return 1;
    }
    if (a.name !== unknownAssetName && b.name === unknownAssetName) {
      return -1;
    }

    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
  });

  return sortedAssets;
};

export { useSortTokenInfosArray };
