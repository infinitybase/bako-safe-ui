import {
  AddressUtils,
  Asset,
  assetsList,
  NFT,
  useGetTokenInfosArray,
  useSortTokenInfosArray,
} from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { ITransactionField } from '../create/useCreateTransactionForm';

interface UseAssetSelectOptionsProps {
  currentAsset: string;
  assets?: Asset[];
  nfts?: NFT[];
  recipients?: ITransactionField[];
  getBalanceAvailable: (assetValue: string) => string;
}

const formatAsset = (asset: Asset) => ({
  label: `${asset.slug} - ${asset.name}`,
  value: asset.assetId,
});

const formatNFT = (nft: NFT) => ({
  label: `NFT - ${AddressUtils.format(nft.assetId ?? '', 20)}`,
  value: nft.assetId,
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
): { assetsOptions: { label: string; value: string }[] } => {
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

  const assetsOptions = [...filteredAssets, ...formattedNFTs];

  return { assetsOptions };
};

export { useAssetSelectOptions };
