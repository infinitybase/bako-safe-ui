import { Avatar, Box, Float, HStack, Icon, Image } from 'bako-ui';
import { memo } from 'react';

import { DoubleArrowIcon } from '@/components';
import { useWorkspaceContext } from '@/modules';

interface AssetsIconWithNetworkProps {
  from: { assetId: string; networkIcon: string; assetIcon: string };
  to: { assetId: string; networkIcon: string; assetIcon: string };
  size?: number;
}

const AssetIconFallback = memo(({ size }: { size: number }) => {
  const { assetsMap } = useWorkspaceContext();
  const unknownAssetIcon = assetsMap['UNKNOWN']?.icon;

  return (
    <Image
      w={size}
      h={size}
      borderRadius="full"
      objectFit="cover"
      src={unknownAssetIcon}
      alt="Unknown asset"
    />
  );
});

AssetIconFallback.displayName = 'AssetIconFallback';

export const AssetsIconWithNetwork = memo(
  ({ from, to, size = 6 }: AssetsIconWithNetworkProps) => {
    return (
      <HStack gap={1} alignItems="center">
        <Box position="relative">
          <Avatar
            w={size}
            h={size}
            src={from.assetIcon}
            fallback={<AssetIconFallback size={size} />}
          />
          <Float placement="bottom-end" offsetX="1" offsetY="1">
            <Avatar
              w={size / 2}
              h={size / 2}
              src={from.networkIcon}
              border="1px solid"
              borderColor="bg.panel"
              fallback={<AssetIconFallback size={size / 2} />}
            />
          </Float>
        </Box>

        <Icon as={DoubleArrowIcon} boxSize={4} color="gray.400" />

        <Box position="relative">
          <Avatar
            w={size}
            h={size}
            src={to.assetIcon}
            fallback={<AssetIconFallback size={size} />}
          />
          <Float placement="bottom-end" offsetX="1" offsetY="1">
            <Avatar
              w={size / 2}
              h={size / 2}
              src={to.networkIcon}
              fallback={<AssetIconFallback size={size / 2} />}
              border="1px solid"
              borderColor="bg.panel"
            />
          </Float>
        </Box>
      </HStack>
    );
  },
);

AssetsIconWithNetwork.displayName = 'AssetsIconWithNetwork';
