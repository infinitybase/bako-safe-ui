import { Box, List, Text } from 'bako-ui';
import { Dispatch, memo, SetStateAction, useLayoutEffect, useRef } from 'react';
import { LegendPayload } from 'recharts';

interface ChartLegendProps {
  iconSize?: number;
  fontSize?: string | number;
  fontWeight?: string | number;
  payload?: readonly LegendPayload[];
  setLegendHeight: Dispatch<SetStateAction<number | null>>;
}

export const ChartLegend = memo((props: ChartLegendProps) => {
  const {
    payload,
    iconSize = 12,
    fontSize = 'xs',
    fontWeight = 'normal',
    setLegendHeight,
  } = props;

  const ref = useRef<HTMLUListElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;

    if (el) {
      setLegendHeight(el.getBoundingClientRect().height);
      return;
    }

    setLegendHeight(null);
  }, [payload, setLegendHeight]);

  return (
    <List.Root
      ref={ref}
      variant="plain"
      className="recharts-default-legend"
      display="flex"
      alignItems="center"
      mr={3}
    >
      {payload?.map((entry, index) => (
        <List.Item key={`${entry.color}-${index}`} alignItems="center" mr={2.5}>
          <List.Indicator asChild>
            <Box
              w={`${iconSize}px`}
              h={`${iconSize}px`}
              borderRadius="full"
              bgColor={entry.color}
              display="inline-block"
              mr={1}
              lineHeight={0}
            />
          </List.Indicator>
          <Text fontSize={fontSize} fontWeight={fontWeight} color={entry.color}>
            {entry.value}
          </Text>
        </List.Item>
      ))}
    </List.Root>
  );
});

ChartLegend.displayName = 'ChartLegend';
