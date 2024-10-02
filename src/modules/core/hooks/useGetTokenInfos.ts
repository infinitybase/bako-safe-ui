import { bn } from 'fuels';

import { isHex } from '@/utils';

import { Asset, AssetMap } from '../utils';

export type IGetTokenInfos = ReturnType<typeof useGetTokenInfos>;

interface IUseGetTokenInfos extends Pick<Asset, 'assetId' | 'amount'> {
  assetsMap: false | AssetMap | undefined;
}

const useGetTokenInfos = ({
  assetId,
  amount = '0.000',
  assetsMap,
}: IUseGetTokenInfos) => {
  const assetsInfo = assetsMap?.[assetId!] ?? assetsMap?.['UNKNOWN'];
  const assetAmount = isHex(amount)
    ? bn(amount).format({
        units: assetsInfo.units,
      })
    : amount;

  return { assetsInfo, assetAmount };
};

export { useGetTokenInfos };
