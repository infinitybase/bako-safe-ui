import { Select, type SelectProps } from '@bako-safe/ui';
import { FormControl } from '@chakra-ui/react';
import type React from 'react';

import {
  AddressUtils,
  type Asset,
  assetsList,
  type NFT,
  useGetTokenInfosArray,
  useSortTokenInfosArray,
} from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface Props extends SelectProps {
  assets?: Asset[];
  nfts?: NFT[];
  helperText?: React.ReactNode;
}

function AssetSelect(props: Props) {
  const { assetsMap } = useWorkspaceContext();

  const formattedAssets = useGetTokenInfosArray(
    props.assets ?? assetsList,
    assetsMap,
  );

  const formattedNfts =
    props.nfts?.map((nft) => ({
      label: `NFT - ${AddressUtils.format(nft.assetId ?? '', 20)}`,
      value: nft.assetId,
    })) ?? [];

  const sortedAssets = useSortTokenInfosArray(formattedAssets, assetsMap).map(
    (asset) => ({
      label: `${asset.slug} - ${asset.name}`,
      value: asset.assetId,
    }),
  );

  return (
    <FormControl>
      <Select
        variant="dark"
        label="Asset"
        value={props.value}
        isInvalid={props.isInvalid}
        onChange={props.onChange}
        options={[...sortedAssets, ...formattedNfts]}
        maxOptionsHeight={120}
      />
      {props.helperText}
    </FormControl>
  );
}

export { AssetSelect };
