import { Box, Card, Skeleton, Text } from 'bako-ui';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';
import { PolarViewBoxRequired, ViewBox } from 'recharts/types/util/types';

import AssetsDonut from '@/components/chart/assets-donut';
import { DonutColors } from '@/components/chart/color';
import { IPredicateAllocation } from '@/modules/core';
import { moneyFormat } from '@/utils';

interface DonutProps {
  allocation?: IPredicateAllocation;
  isLoading: boolean;
}

const MotionBody = motion(Card.Body);

const isPolarViewBox = (viewBox: ViewBox): viewBox is PolarViewBoxRequired =>
  'cx' in viewBox && 'cy' in viewBox;

const DonutLabel = ({
  viewBox,
  title,
}: {
  viewBox: ViewBox | undefined;
  title: string;
}) => {
  if (!viewBox || !isPolarViewBox(viewBox)) return null;

  const fontSize = 14;
  const padding = 8;

  // Estimate text width (approximately 0.6 * fontSize per character)
  const textWidth = title.length * fontSize * 0.6;
  const textHeight = fontSize;

  // Calculate rectangle dimensions and position
  const rectWidth = textWidth + padding * 2;
  const rectHeight = textHeight + padding * 2;
  const rectX = viewBox.cx - rectWidth / 2;
  const rectY = viewBox.cy - rectHeight / 2;

  return (
    <g>
      {/* Background rectangle with rounded corners */}
      <rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        rx={5}
        ry={5}
        fill="#2B2927"
      />
      {/* Text */}
      <text
        x={viewBox.cx}
        y={viewBox.cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#E6E6E6"
        style={{
          fontSize: fontSize,
          fontWeight: 'bold',
        }}
      >
        {title}
      </text>
    </g>
  );
};

const Donut = memo(({ allocation, isLoading }: DonutProps) => {
  const isEmpty = useMemo(
    () => !isLoading && (!allocation || !allocation.totalAmountInUSD),
    [allocation, isLoading],
  );

  const data = useMemo(
    () =>
      allocation?.data.map((asset, i) => ({
        label: asset.assetId || 'Other',
        value: asset.amountInUSD,
        color: DonutColors[i % DonutColors.length], // Cycle through colors if more assets than colors
      })) ?? [],
    [allocation],
  );

  return (
    <MotionBody
      justifyContent="center"
      alignItems="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isEmpty && (
        <Text color="textSecondary" textAlign="center">
          Nothing to show here yet
        </Text>
      )}
      {!isEmpty && (
        <AssetsDonut
          width="185px"
          data={data}
          tooltipProps={{ active: false }}
          label={({ viewBox }) => (
            <DonutLabel
              viewBox={viewBox}
              title={moneyFormat(allocation?.totalAmountInUSD || 0)}
            />
          )}
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
