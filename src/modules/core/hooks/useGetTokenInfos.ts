import { bn } from 'fuels';

import { isHex } from '@/utils';

import { Asset, AssetMap } from '../utils';
import { parseURI } from '../utils/formatter';

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

  let nftImageUrl = null;

  if (assetsInfo.metadata) {
    const imageKeys = ['image'];
    const imageKey = Object.keys(assetsInfo.metadata).find((key) =>
      imageKeys.includes(key.split(':').at(0)!),
    );
    const nftnftImageUrl = parseURI(assetsInfo.metadata[imageKey!]);
    nftImageUrl = nftnftImageUrl || nftImageUrl;
  }

  const assetAmount = isHex(amount)
    ? bn(amount)?.format({
        units: assetsInfo?.units ?? assetsMap.UNKNOWN.units,
      })
    : amount;

  return { assetsInfo, assetAmount, nftImageUrl };
};

export { useGetTokenInfos };
