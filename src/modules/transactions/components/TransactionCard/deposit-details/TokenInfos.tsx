import { Image, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import NftEmpty from '@/assets/nft-empty.svg';
import { AssetModel } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface TokenInfosProps {
  asset: AssetModel;
  isNFT: boolean;
}

const TokenInfos = ({ asset, isNFT }: TokenInfosProps) => {
  const { assetsMap } = useWorkspaceContext();
  const assetInfo = useMemo(
    () =>
      asset?.assetId && assetsMap?.[asset?.assetId]
        ? assetsMap[asset?.assetId]
        : assetsMap?.['UNKNOWN'],
    [asset?.assetId],
  );
  return (
    <VStack minW="76px" alignItems="start">
      <Image
        w={6}
        h={6}
        src={isNFT ? NftEmpty : (assetInfo?.icon ?? '')}
        borderRadius={100}
        alt="Asset Icon"
        objectFit="cover"
      />
      <Text fontSize="sm" color="grey.500">
        {isNFT ? 'NFT' : assetInfo?.slug}
      </Text>
    </VStack>
  );
};
export default TokenInfos;
