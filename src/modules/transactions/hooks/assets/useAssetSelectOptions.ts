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
  recipientAssets: Set<string>,
  nfts?: NFT[],
) =>
  nfts?.filter(
    (nft) => nft.assetId === currentAsset || !recipientAssets.has(nft.assetId),
  ) ?? [];

const useAssetSelectOptions = (props: UseAssetSelectOptionsProps) => {
  const { currentAsset, recipients, assets, nfts } = props;

  const { assetsMap } = useWorkspaceContext();

  const recipientAssets = new Set(
    recipients?.map((recipient) => recipient.asset),
  );
  const filteredNFTs = filterNFTs(currentAsset, recipientAssets, nfts);
  const formattedNFTs = filteredNFTs.map(formatNFT);

  const formattedAssets = useGetTokenInfosArray(
    assets ?? assetsList,
    assetsMap,
  );
  const sortedAssets = useSortTokenInfosArray(formattedAssets, assetsMap).map(
    formatAsset,
  );

  return { assetsOptions: [...sortedAssets, ...formattedNFTs] };
};

export { useAssetSelectOptions };
