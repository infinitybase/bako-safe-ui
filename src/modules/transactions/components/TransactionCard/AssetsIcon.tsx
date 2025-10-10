import { AvatarGroup, Image, Skeleton } from '@chakra-ui/react';
import { ITransferAsset } from 'bakosafe';
import { memo, useMemo } from 'react';

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
  ({ assets, isMobile, showOnlyOneAsset, assetsMap }: AssetsIconProps) => {
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
              metadataAssets?.[asset.assetId]?.metadata?.['URI'] ||
              metadataAssets?.[asset.assetId]?.icon ||
              assetsMap.UNKNOWN.icon!,
          ),
        })),
      [assets, metadataAssets, assetsMap.UNKNOWN.icon],
    );

    return (
      <AvatarGroup
        // max={showOnlyOneAsset ? 1 : 2}
        size="md"
        borderRadius="md"
        justifyContent={isMobile ? 'start' : 'end'}
        position="relative"
      >
        {assetsWithImage.map((asset) => (
          <Skeleton
            key={asset.assetId}
            loading={isLoading}
            borderRadius="md"
            w={{ base: '30.5px', sm: 7 }}
            h={{ base: 'full', sm: 7 }}
          >
            <Image
              w={{ base: '30.5px', sm: 7 }}
              h={{ base: 'full', sm: 7 }}
              // fallbackStrategy="onError"
              src={asset.image || assetsMap?.['UNKNOWN'].icon}
              borderRadius="md"
              alt="Asset Icon"
              objectFit="cover"
            />
          </Skeleton>
        ))}
      </AvatarGroup>
    );
  },
);

AssetsIcon.displayName = 'AssetsIcon';
