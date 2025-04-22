import { bn } from 'fuels';
import { useMemo } from 'react';

import { UseAssetMap } from '@/modules/assets-tokens/hooks/useAssetMap';
import { isHex } from '@/utils';

import { Asset, AssetMap, DefaultMetadata, NFT } from '../utils';
import { parseURI } from '../utils/formatter';

export type IGetTokenInfos = ReturnType<typeof useGetTokenInfos>;

interface IUseGetTokenInfos extends Pick<Asset, 'assetId' | 'amount'> {
  assetsMap: AssetMap;
}
interface IUseGetNftInfos extends Omit<NFT, 'name'> {
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

  const nftImageUrl = useMemo(() => {
    if (!nftsInfo?.metadata) return null;

    const imageKeys = ['image'];
    const imageKey = Object.keys(nftsInfo.metadata).find((key) =>
      imageKeys.includes(key.split(':')[0]),
    );

    if (imageKey) {
      const parsedUrl = parseURI(nftsInfo.metadata[imageKey]);
      if (parsedUrl) return parsedUrl;
    }

    return (nftsInfo.metadata as DefaultMetadata).image || null;
  }, [nftsInfo]);

  return { nftsInfo, nftImageUrl };
};

export { useGetNftsInfos, useGetTokenInfos };
