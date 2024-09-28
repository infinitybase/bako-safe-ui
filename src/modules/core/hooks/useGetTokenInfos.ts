import { bn } from 'fuels';

import { isHex } from '@/utils';

import { Asset, assetsMap } from '../utils';

export type IGetTokenInfos = ReturnType<typeof useGetTokenInfos>;

const useGetTokenInfos = ({
  assetId,
  amount = '0.000',
}: Pick<Asset, 'assetId' | 'amount'>) => {
  const assetsInfo = assetsMap[assetId!] ?? assetsMap['UNKNOWN'];
  const assetAmount = isHex(amount)
    ? bn(amount).format({
        units: assetsInfo.units,
      })
    : amount;

  return { assetsInfo, assetAmount };
};

export { useGetTokenInfos };
