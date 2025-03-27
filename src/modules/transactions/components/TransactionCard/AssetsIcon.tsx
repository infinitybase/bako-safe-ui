import { AvatarGroup, Image } from '@chakra-ui/react';
import { ITransferAsset } from 'bakosafe';
import { memo } from 'react';

import { AssetMap } from '@/modules/core';

interface AssetsIconProps {
  assets: ITransferAsset[];
  isMobile: boolean;
  showOnlyOneAsset: boolean;
  assetsMap: AssetMap;
}

export const AssetsIcon = memo(
  ({ assets, isMobile, showOnlyOneAsset, assetsMap }: AssetsIconProps) => {
    return (
      <AvatarGroup
        max={showOnlyOneAsset ? 1 : 2}
        w={isMobile ? 'unset' : 56}
        justifyContent={isMobile ? 'start' : 'end'}
        position="relative"
      >
        {assets.map((asset) => (
          <Image
            key={asset.assetId}
            w={{ base: '30.5px', sm: 6 }}
            h={{ base: 'full', sm: 6 }}
            src={assetsMap[asset.assetId]?.icon ?? assetsMap.UNKNOWN.icon}
            borderRadius={100}
            alt="Asset Icon"
            objectFit="cover"
          />
        ))}
      </AvatarGroup>
    );
  },
);

AssetsIcon.displayName = 'AssetsIcon';
