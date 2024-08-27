import { bn } from 'fuels';

import { Asset, assetsMap } from '../utils';

const useGetTokenInfosArray = (assets: Asset[]) => {
  const processAsset = (asset: Asset) => {
    const assetsInfo = assetsMap[asset.assetId] ?? assetsMap['UNKNOWN'];
    return {
      ...assetsInfo,
      assetId: asset.assetId,
      amount: bn(asset.amount).format(),
    };
  };

  return assets.map(processAsset);
};

export { useGetTokenInfosArray };
