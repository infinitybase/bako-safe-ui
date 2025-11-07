import { AssetSelectOption } from '@/components';
import {
  AddressUtils,
  Asset,
  assetsList,
  NFT,
  useGetTokenInfosArray,
  useSortTokenInfosArray,
} from '@/modules/core';
import { parseURI } from '@/modules/core/utils/formatter';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { ITransactionField } from '../create/useCreateTransactionForm';

interface UseAssetSelectOptionsProps {
  currentAsset: string;
  assets?: Asset[];
  nfts?: NFT[];
  recipients?: ITransactionField[];
  getBalanceAvailable: (assetValue: string) => string;
}

const formatAsset = (asset: Asset) => ({
  name: asset.name,
  symbol: asset.slug,
  value: asset.assetId,
  image: asset.icon || null,
});

const formatNFT = (nft: NFT) => ({
  value: nft.assetId,
  image: nft.image ? parseURI(nft.image) : null,
  name: nft.name ?? AddressUtils.format(nft.assetId, 10),
  symbol: nft.symbol ?? null,
});

const filterNFTs = (
  currentAsset: string,
  recipients?: ITransactionField[],
  nfts: NFT[] = [],
) => {
  const recipientAssets = new Set(
    recipients?.map((recipient) => recipient.asset),
  );
  const filteredNFTs = nfts.filter(
    (nft) => nft.assetId === currentAsset || !recipientAssets.has(nft.assetId),
  );

  return filteredNFTs;
};

const useAssetSelectOptions = (
  props: UseAssetSelectOptionsProps,
): {
  assetsOptions: AssetSelectOption[];
} => {
  const { currentAsset, recipients, assets, nfts, getBalanceAvailable } = props;

  const { assetsMap } = useWorkspaceContext();

  const filteredNFTs = filterNFTs(currentAsset, recipients, nfts);
  const formattedNFTs = filteredNFTs.map(formatNFT);

  const _assets = useGetTokenInfosArray(assets ?? assetsList, assetsMap);
  const sortedAssets = useSortTokenInfosArray(_assets, assetsMap);
  const formattedAssets = sortedAssets.map(formatAsset);

  const filteredAssets = formattedAssets.filter((asset) => {
    const balanceAvailableForAsset = parseFloat(
      getBalanceAvailable(asset.value),
    );

    return balanceAvailableForAsset > 0;
  });

  const options = [...filteredAssets, ...formattedNFTs];

  const assetsOptions = options.map((option) => ({
    ...option,
    image: option.image ?? (assetsMap?.UNKNOWN?.icon || ''),
  }));

  return { assetsOptions };
};

export { useAssetSelectOptions };
