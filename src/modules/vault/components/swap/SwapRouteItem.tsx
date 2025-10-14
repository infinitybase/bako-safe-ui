import { Flex, Image, Text } from 'bako-ui';
import { PoolId } from 'mira-dex-ts';
import { memo } from 'react';

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
      <Image src={assetA?.icon || ''} alt={assetA?.name || ''} boxSize="16px" />
      <Image
        src={assetB?.icon || ''}
        alt={assetB?.name || ''}
        boxSize="16px"
        marginLeft={-1}
      />
      <Text fontSize="sm" color="grey.75" ml={2}>
        ({fee}%)
      </Text>
    </Flex>
  );
});
