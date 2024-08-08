import { bn } from 'fuels';
import { Asset, assetsMap } from '../utils';

const useGetTokenInfos = (asset: Asset) => {
  const isAmountBnFormat = asset.amount?.startsWith('0x');
  let assetAmount: string | undefined = '';

  const assetsInfo = assetsMap[asset.assetId];
  if (isAmountBnFormat) {
    assetAmount = bn(asset.amount!).format();
  } else {
    assetAmount = asset.amount;
  }

  return { assetsInfo, assetAmount };
};

export { useGetTokenInfos };
