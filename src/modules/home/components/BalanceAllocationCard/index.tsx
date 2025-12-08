import { Box, Card, Heading, Skeleton, Text } from 'bako-ui';
import { memo, useMemo } from 'react';

import AdvancedDonut from '@/components/chart/advanced-donut';
import { DonutColors } from '@/components/chart/color';
import { getChainId, useUserAllocationRequest } from '@/modules';
import { useAssetMap } from '@/modules/assets-tokens/hooks/useAssetMap';

const BalanceAllocationCard = memo(() => {
  const { allocation, isLoading } = useUserAllocationRequest();
  const chainId = getChainId();
  const assetsMap = useAssetMap(chainId).assetsMap;
  const chartData = useMemo(
    () =>
      allocation?.data.map((asset, i) => ({
        label: asset.assetId ? assetsMap[asset.assetId]?.name : 'Other',
        value: asset.amountInUSD,
        percentage: asset.percentage,
        color: DonutColors[i % DonutColors.length], // Cycle through colors if more assets than colors
      })) ?? [],
    [allocation, assetsMap],
  );

  const isEmpty = useMemo(() => !chartData.length, [chartData]);

  return (
    <Card.Root
      variant="subtle"
      bg="bg.panel"
      h="full"
      rounded="2xl"
      maxH="388px"
    >
      <Card.Header>
        <Heading
          color="textPrimary"
          fontSize="sm"
          fontWeight="semibold"
          letterSpacing="wider"
        >
          Balance allocation
        </Heading>
      </Card.Header>
      <Card.Body alignItems="center" justifyContent="center">
        {!isEmpty && <AdvancedDonut data={chartData} />}

        {!isLoading && isEmpty && (
          <Text color="textSecondary" textAlign="center">
            Nothing to show here yet
          </Text>
        )}

        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            w="full"
          >
            <Skeleton height="200px" w="200px" rounded="full" />
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
});

BalanceAllocationCard.displayName = 'BalanceAllocationCard';

export default BalanceAllocationCard;
