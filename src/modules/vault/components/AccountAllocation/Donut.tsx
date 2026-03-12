import { Box, Card, Skeleton, Text } from 'bako-ui';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

import AdvancedDonut from '@/components/chart/advanced-donut';
import { DonutColors } from '@/components/chart/color';
import { useAssetMap } from '@/modules/assets-tokens/hooks/useAssetMap';
import { getChainId, IPredicateAllocation } from '@/modules/core';

interface DonutProps {
  allocation?: IPredicateAllocation;
  isLoading: boolean;
  visibleBalance?: boolean;
}

const MotionBody = motion(Card.Body);

const Donut = memo(({ allocation, isLoading, visibleBalance }: DonutProps) => {
  const isEmpty = useMemo(
    () => !allocation || !allocation.totalAmountInUSD,
    [allocation],
  );

  const chainId = getChainId();
  const assetsMap = useAssetMap(chainId).assetsMap;
  const data = useMemo(
    () =>
      allocation?.data.map((asset, i) => ({
        label: asset.assetId
          ? (assetsMap[asset.assetId]?.name ?? asset.assetId)
          : 'Other',
        value: asset.amountInUSD,
        percentage: asset.percentage,
        color: DonutColors[i % DonutColors.length], // Cycle through colors if more assets than colors
      })) ?? [],
    [allocation, assetsMap],
  );

  return (
    <MotionBody
      justifyContent="center"
      alignItems="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      p={0}
    >
      {isEmpty && !isLoading && (
        <Text color="gray.400" textAlign="center" fontSize="xs">
          Nothing to show here yet
        </Text>
      )}
      {!isEmpty && !isLoading && (
        <AdvancedDonut
          data={data}
          visibleBalance={!visibleBalance}
          showLegend={false}
        />
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
    </MotionBody>
  );
});

Donut.displayName = 'Donut';

export default Donut;
