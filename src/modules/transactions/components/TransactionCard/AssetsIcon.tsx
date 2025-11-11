import { AvatarGroup, Center, Image, Skeleton, Text } from 'bako-ui';
import { ITransferAsset } from 'bakosafe';
import { memo, useMemo } from 'react';

import { AssetMap } from '@/modules/core';
import { parseURI } from '@/modules/core/utils/formatter';

import { useGetAssetsMetadata } from '../../hooks/assets/useGetAssetsMetadata';
interface AssetsIconProps {
  assets: ITransferAsset[];
  assetsMap: AssetMap;
  size?: number | string;
}

export const AssetsIcon = memo(
  ({ assets, assetsMap, size = 6 }: AssetsIconProps) => {
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

    const assetsToShow = useMemo(
      () => assetsWithImage.slice(0, 2),
      [assetsWithImage],
    );

    return (
      <AvatarGroup
        spaceX={-3}
        borderRadius="md"
        justifyContent={{ sm: 'start', base: 'end' }}
        position="relative"
      >
        {assetsToShow.map((asset) => (
          <Skeleton
            key={asset.assetId + asset.to + asset.amount} // prevent duplicate keys
            loading={isLoading}
            borderRadius="md"
            w={size}
            h={size}
          >
            <Image
              w={size}
              h={size}
              src={asset.image || assetsMap?.['UNKNOWN'].icon}
              borderRadius="md"
              alt="Asset Icon"
              objectFit="cover"
            />
          </Skeleton>
        ))}
        {assets.length > 2 && (
          <Skeleton loading={isLoading} borderRadius="md">
            <Center
              w={size}
              h={size}
              rounded="full"
              bg="primary.main"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="primary.contrast" fontSize="2xs">
                + {assets.length - 2}
              </Text>
            </Center>
          </Skeleton>
        )}
      </AvatarGroup>
    );
  },
);

AssetsIcon.displayName = 'AssetsIcon';
