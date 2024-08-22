import { bn } from 'fuels';

import { Asset, assetsMap } from '../utils';

export type IGetTokenInfos = ReturnType<typeof useGetTokenInfos>;

const useGetTokenInfos = ({ assetId, amount = '0.000' }: Partial<Asset>) => {
  const isHex = (value: string) => {
    const hexRegex = /^0x[0-9a-fA-F]+$/;
    return typeof value === 'string' && hexRegex.test(value);
  };

  const assetsInfo = assetsMap[assetId!];
  const assetAmount = isHex(amount) ? bn(amount).format() : amount;

  return { assetsInfo, assetAmount };
};

export { useGetTokenInfos };
