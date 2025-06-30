import { AvatarGroup, Image, Skeleton } from '@chakra-ui/react';
import { ITransferAsset } from 'bakosafe';
import { memo, useMemo } from 'react';

import { TransactionCard } from '@/modules';
import { AssetMap } from '@/modules/core';
import { parseURI } from '@/modules/core/utils/formatter';

import { useGetAssetsMetadata } from '../../hooks/assets/useGetAssetsMetadata';
interface AssetsIconProps {
  assets: ITransferAsset[];
  isMobile: boolean;
  showOnlyOneAsset: boolean;
  assetsMap: AssetMap;
  isNFT: boolean;
}

export const AssetsIcon = memo(
  ({
    assets,
    isMobile,
    showOnlyOneAsset,
    assetsMap,
    isNFT,
  }: AssetsIconProps) => {
    const { assets: metadataAssets, isLoading } = useGetAssetsMetadata(
      assets.map((asset) => asset.assetId),
    );

    const assetsWithImage = useMemo(
      () =>
        assets.map((asset) => ({
          ...asset,
          image: parseURI(
            metadataAssets?.[asset.assetId]?.metadata?.image ||
              metadataAssets?.[asset.assetId]?.metadata?.['image:png'] ||
              metadataAssets?.[asset.assetId]?.icon ||
              (isNFT && '/nft-empty.svg') ||
              assetsMap.UNKNOWN.icon!,
          ),
          isNFTHandle:
            !!metadataAssets?.[asset.assetId]?.metadata?.['image:png'],
        })),
      [assets, metadataAssets, assetsMap, isNFT],
    );

    return (
      <AvatarGroup
        max={showOnlyOneAsset ? 1 : 2}
        size="md"
        borderRadius="md"
        justifyContent={isMobile ? 'start' : 'end'}
        position="relative"
      >
        {assetsWithImage.map((asset) => (
          <Skeleton
            key={asset.assetId}
            isLoaded={!isLoading}
            borderRadius="md"
            w={{ base: '30.5px', sm: 7 }}
            h={{ base: 'full', sm: 7 }}
          >
            {asset.isNFTHandle ? (
              <TransactionCard.NFTHandler boxSize={7} image={asset.image} />
            ) : (
              <Image
                w={{ base: '30.5px', sm: 7 }}
                h={{ base: 'full', sm: 7 }}
                src={asset.image}
                borderRadius="md"
                alt="Asset Icon"
                objectFit="cover"
              />
            )}
          </Skeleton>
        ))}
      </AvatarGroup>
    );
  },
);

AssetsIcon.displayName = 'AssetsIcon';
