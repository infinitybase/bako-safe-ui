import { bn } from 'fuels';
import { Asset, assetsMap } from '../utils';

const useGetTokenInfos = (asset: Asset) => {
  const assetsInfo = assetsMap[asset.assetId];
  const assetAmount = bn(asset.amount).format();

  return { assetsInfo, assetAmount };
};

export { useGetTokenInfos };
