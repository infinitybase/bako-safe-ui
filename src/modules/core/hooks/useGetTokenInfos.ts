import { bn } from 'fuels';
import { useMemo } from 'react';

import { UseAssetMap } from '@/modules/assets-tokens/hooks/useAssetMap';
import { isHex } from '@/utils';

import { Asset, AssetMap, defaultMetadata, NFT } from '../utils';
import { parseURI } from '../utils/formatter';

export type IGetTokenInfos = ReturnType<typeof useGetTokenInfos>;

interface IUseGetTokenInfos extends Pick<Asset, 'assetId' | 'amount'> {
  assetsMap: AssetMap;
}
interface IUseGetNftInfos extends NFT {
  nftList: UseAssetMap['nftList'];
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

const useGetNftsInfos = ({ assetId, nftList }: IUseGetNftInfos) => {
  const nftsInfo = useMemo(() => {
    return nftList.find((nft) => nft.assetId === assetId);
  }, [assetId, nftList]);

  let nftImageUrl = null;

  if (nftsInfo?.metadata) {
    const imageKeys = ['image'];
    const imageKey = Object.keys(nftsInfo.metadata).find((key) =>
      imageKeys.includes(key.split(':').at(0)!),
    );
    const nftnftImageUrl = parseURI(nftsInfo.metadata[imageKey!]);
    const metadata = nftsInfo.metadata as defaultMetadata;
    nftImageUrl = nftnftImageUrl || metadata.image;
  }

  return { nftsInfo, nftImageUrl };
};

export { useGetNftsInfos, useGetTokenInfos };
