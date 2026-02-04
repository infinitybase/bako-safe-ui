import { Box, Card, Heading, Skeleton, Text } from 'bako-ui';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

import AdvancedDonut from '@/components/chart/advanced-donut';
import { DonutColors } from '@/components/chart/color';
import {
  getChainId,
  useUserAllocationRequest,
  useWorkspaceContext,
} from '@/modules';
import { useAssetMap } from '@/modules/assets-tokens/hooks/useAssetMap';

const MotionBox = motion(Box);

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

  const {
    workspaceInfos: {
      infos: { visibleBalance },
    },
  } = useWorkspaceContext();

  const isEmpty = useMemo(() => !chartData.length, [chartData]);

  return (
    <Card.Root variant="subtle" bg="bg.panel" rounded="2xl">
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

      <MotionBox
        animate={{
          height: isLoading ? 338 : !isEmpty ? 338 : 158,
        }}
        initial={false}
        transition={{
          duration: 1,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          overflow: 'hidden',
          position: 'relative',
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {!isEmpty && (
          <AdvancedDonut data={chartData} visibleBalance={!visibleBalance} />
        )}

        {!isLoading && isEmpty && (
          <Text color="textSecondary" textAlign="center">
            Nothing to show here yet
          </Text>
        )}

        {isLoading && (
          <Box
            position="absolute"
            inset={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Skeleton h="200px" w="200px" rounded="full" />
          </Box>
        )}
      </MotionBox>
    </Card.Root>
  );
});

BalanceAllocationCard.displayName = 'BalanceAllocationCard';

export default BalanceAllocationCard;
