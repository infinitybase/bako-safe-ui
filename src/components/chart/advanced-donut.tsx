import { Chart, useChart } from 'bako-ui';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Cell, Label, Legend, Pie, PieChart, Sector } from 'recharts';

import { moneyFormat } from '@/utils';

import { ChartLabel } from './chart-label';
import { ChartLegend } from './chart-legend';

export interface ChartData {
  label: string;
  value: number;
  color: string;
  percentage: number;
  // Add index signature to allow dynamic property access
  [key: string]: string | number;
}

interface AdvancedDonutProps
  extends Omit<React.ComponentProps<typeof Chart.Root>, 'chart' | 'children'> {
  data: ChartData[];
  pieProps?: React.ComponentProps<typeof Pie>;
  pieChartProps?: React.ComponentProps<typeof PieChart>;
  legendProps?: React.ComponentProps<typeof Legend>;
}

const AdvancedDonut = ({
  data,
  pieProps,
  pieChartProps,
  legendProps,
  ...props
}: AdvancedDonutProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chart = useChart({ data });
  const [legendHeight, setLegendHeight] = useState<number | null>(null);

  const legendFlexDirection =
    legendProps?.layout === 'vertical' ? 'column' : 'row';

  const onLegendFocusEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const onLegendFocusLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data],
  );

  const labelData = useMemo(() => {
    if (activeIndex !== null) {
      return {
        title: moneyFormat(data[activeIndex].value),
        label: data[activeIndex].label,
        percentage: data[activeIndex].percentage,
      };
    }
    return {
      title: moneyFormat(total),
      label: undefined,
      percentage: undefined,
    };
  }, [activeIndex, data, total]);

  return (
    <Chart.Root
      chart={chart}
      width="full"
      maxW="256px"
      maxH="256px"
      h="256px"
      css={{
        '& .recharts-default-legend': {
          display: 'flex',
          flexDirection: legendFlexDirection,
          alignItems: 'center',
          flexWrap: 'wrap',
        },
        '& .recharts-legend-item': {
          display: 'flex !important',
          alignItems: 'center',
        },
      }}
      {...props}
    >
      <PieChart responsive {...pieChartProps}>
        <Pie
          innerRadius={80}
          outerRadius={100}
          isAnimationActive={false}
          data={chart.data}
          dataKey={chart.key('value')}
          nameKey="label"
          paddingAngle={4}
          activeShape={<Sector outerRadius={110} />}
          stroke="none"
          {...pieProps}
        >
          {legendHeight !== null && (
            <Label
              position="middle"
              content={({ viewBox }) => (
                <ChartLabel
                  viewBox={viewBox}
                  title={labelData.title}
                  label={labelData.label}
                  percentage={labelData.percentage}
                  legendHeight={legendHeight}
                />
              )}
            />
          )}

          {chart.data.map((item, index) => (
            <Cell
              key={item.label}
              fill={chart.color(item.color)}
              onMouseEnter={() => onLegendFocusEnter(index)}
              onMouseLeave={onLegendFocusLeave}
            />
          ))}
        </Pie>

        <Legend
          iconSize={12}
          {...legendProps}
          wrapperStyle={{
            bottom: 0,
            ...legendProps?.wrapperStyle,
          }}
          content={(props) => (
            <ChartLegend {...props} setLegendHeight={setLegendHeight} />
          )}
        />
      </PieChart>
    </Chart.Root>
  );
};

export default memo(AdvancedDonut);
