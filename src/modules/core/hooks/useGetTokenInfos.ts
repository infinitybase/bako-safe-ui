import { bn } from 'fuels';

import { isHex } from '@/utils';

import { Asset, AssetMap } from '../utils';

export type IGetTokenInfos = ReturnType<typeof useGetTokenInfos>;

interface IUseGetTokenInfos extends Pick<Asset, 'assetId' | 'amount'> {
  assetsMap: AssetMap;
}

const useGetTokenInfos = ({
  assetId,
  amount = bn.parseUnits('0').toString(),
  assetsMap,
}: IUseGetTokenInfos) => {
  const assetsInfo = assetsMap?.[assetId] ?? assetsMap?.['UNKNOWN'];
  const assetAmount = isHex(amount)
    ? bn(amount)?.format({
        units: assetsInfo?.units ?? assetsMap.UNKNOWN.units,
      })
    : amount;

  return { assetsInfo, assetAmount };
};

export { useGetTokenInfos };
