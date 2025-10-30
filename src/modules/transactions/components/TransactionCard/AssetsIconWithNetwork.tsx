import { Avatar, Box, Float, HStack, Icon } from 'bako-ui';
import { memo } from 'react';

import { DoubleArrowIcon } from '@/components';
import { useWorkspaceContext } from '@/modules';

interface AssetsIconWithNetworkProps {
  from: { assetId: string; networkIcon: string; assetIcon: string };
  to: { assetId: string; networkIcon: string; assetIcon: string };
  size?: number;
}

export const AssetsIconWithNetwork = memo(
  ({ from, to, size = 6 }: AssetsIconWithNetworkProps) => {
    const { assetsMap } = useWorkspaceContext();

    const unknownAssetIcon = assetsMap['UNKNOWN']?.icon;

    return (
      <HStack gap={1} alignItems="center">
        <Box position="relative">
          <Avatar
            w={size}
            h={size}
            src={from.assetIcon}
            fallback={unknownAssetIcon}
          />
          <Float placement="bottom-end" offsetX="1" offsetY="1">
            <Avatar
              w={size / 2}
              h={size / 2}
              src={from.networkIcon}
              border="1px solid"
              borderColor="bg.panel"
              fallback={unknownAssetIcon}
            />
          </Float>
        </Box>

        <Icon as={DoubleArrowIcon} boxSize={4} color="gray.400" />

        <Box position="relative">
          <Avatar
            w={size}
            h={size}
            src={to.assetIcon}
            fallback={unknownAssetIcon}
          />
          <Float placement="bottom-end" offsetX="1" offsetY="1">
            <Avatar
              w={size / 2}
              h={size / 2}
              src={to.networkIcon}
              fallback={unknownAssetIcon}
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
