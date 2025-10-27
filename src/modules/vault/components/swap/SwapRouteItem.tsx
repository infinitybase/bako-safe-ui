import { Avatar, Flex, Text } from 'bako-ui';
import { PoolId } from 'mira-dex-ts';
import { memo } from 'react';

import { UnknownIcon } from '@/components';
import { useAssetMetadata } from '@/modules/assets-tokens/hooks/useAssetMetadata';

export const SwapRouteItem = memo(function SwapRouteItem({
  pool,
}: {
  pool: PoolId;
}) {
  const { asset: assetA } = useAssetMetadata(pool[0].bits);
  const { asset: assetB } = useAssetMetadata(pool[1].bits);
  const fee = pool[2] ? 0.05 : 0.3;

  return (
    <Flex alignItems="center">
      <Avatar src={assetA?.icon} boxSize="16px" fallback={<UnknownIcon />} />
      <Avatar
        src={assetB?.icon}
        boxSize="16px"
        marginLeft={-1}
        fallback={<UnknownIcon />}
      />
      <Text fontSize="sm" color="textPrimary" ml={2}>
        ({fee}%)
      </Text>
    </Flex>
  );
});
