import { Card, Heading, Skeleton, Text } from 'bako-ui';
import { motion } from 'framer-motion';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

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

  const cardRef = useRef<HTMLDivElement | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [parentHeight, setParentHeight] = useState(211);

  useEffect(() => {
    if (!cardRef.current?.parentElement) return;

    const parent = cardRef.current.parentElement;

    const resizeObserver = new ResizeObserver(() => {
      const h = parent.clientHeight;
      if (h > 0) setParentHeight(h);
    });

    resizeObserver.observe(parent);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isLoading) setExpanded(true);
  }, [isLoading]);

  return (
    <MotionCardRoot
      ref={cardRef}
      variant="subtle"
      bg="bg.panel"
      rounded="2xl"
      h="full"
      minH="211px"
      display="flex"
      flexDirection="column"
      style={{ overflow: 'hidden', position: 'relative' }}
      initial={{ height: 211 }}
      animate={{ height: expanded ? parentHeight : 211 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {isLoading && <Skeleton height="211px" w="100%" />}

      <Card.Header>
        {!isLoading && (
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
        {!isEmpty ? (
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

        {!isLoading && isEmpty && (
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
