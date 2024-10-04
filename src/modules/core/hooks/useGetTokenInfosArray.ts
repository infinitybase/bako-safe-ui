import { bn } from 'fuels';

import { Asset, AssetMap } from '../utils';

const useGetTokenInfosArray = (
  assets: Asset[],
  assetsMap: false | AssetMap | undefined,
) => {
  const processAsset = (asset: Asset) => {
    const assetsInfo = assetsMap?.[asset.assetId] ?? assetsMap?.['UNKNOWN'];
    return {
      ...assetsInfo,
      assetId: asset.assetId,
      amount: bn(asset.amount).format({ units: assetsInfo.units }),
    };
  };

  return assets.map(processAsset);
};

export { useGetTokenInfosArray };
