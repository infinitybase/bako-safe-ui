import { Card, Heading, Skeleton, Text } from 'bako-ui';
import { motion } from 'framer-motion';
import { memo, useEffect, useMemo, useState } from 'react';

import AdvancedDonut from '@/components/chart/advanced-donut';
import { DonutColors } from '@/components/chart/color';
import {
  getChainId,
  useUserAllocationRequest,
  useWorkspaceContext,
} from '@/modules';
import { useAssetMap } from '@/modules/assets-tokens/hooks/useAssetMap';

const MotionCardRoot = motion(Card.Root);

const BalanceAllocationCard = memo(() => {
  const { allocation, isLoading, isFetching } = useUserAllocationRequest();
  const chainId = getChainId();
  const assetsMap = useAssetMap(chainId).assetsMap;
  const isPending = isLoading || isFetching;
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
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isPending) {
      setExpanded(false);
    } else if (!isEmpty) {
      setExpanded(true);
    }
  }, [isPending, isEmpty]);

  return (
    <MotionCardRoot
      variant="subtle"
      bg="bg.panel"
      rounded="2xl"
      h="full"
      display="flex"
      flexDirection="column"
      style={{ overflow: 'hidden', position: 'relative' }}
      initial={{ height: '100%' }}
      animate={{
        height: expanded && !isEmpty && !isPending ? 390 : '100%',
      }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {isPending && <Skeleton height="100%" w="100%" />}

      <Card.Header>
        {!isPending && (
          <Heading
            color="textPrimary"
            fontSize="sm"
            fontWeight="semibold"
            letterSpacing="wider"
          >
            Balance allocation
          </Heading>
        )}
      </Card.Header>

      <Card.Body
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        w="full"
      >
        {!isPending && !isEmpty ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AdvancedDonut data={chartData} visibleBalance={!visibleBalance} />
          </motion.div>
        ) : null}

        {!isPending && isEmpty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Text color="textSecondary" textAlign="center">
              Nothing to show here yet
            </Text>
          </motion.div>
        )}
      </Card.Body>
    </MotionCardRoot>
  );
});

BalanceAllocationCard.displayName = 'BalanceAllocationCard';

export default BalanceAllocationCard;
