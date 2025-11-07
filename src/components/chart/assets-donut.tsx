import { Chart, useChart } from 'bako-ui';
import React, { memo } from 'react';
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';

interface ChartData {
  label: string;
  value: number;
  color: string;
  // Add index signature to allow dynamic property access
  [key: string]: string | number;
}

interface AssetsDonutProps
  extends Omit<React.ComponentProps<typeof Chart.Root>, 'chart' | 'children'> {
  data: ChartData[];
  pieProps?: React.ComponentProps<typeof Pie>;
  pieChartProps?: React.ComponentProps<typeof PieChart>;
  tooltipProps?: React.ComponentProps<typeof Tooltip>;
  label?: React.ComponentProps<typeof Label>['content'];
}

const AssetsDonut = ({
  data,
  pieProps,
  pieChartProps,
  tooltipProps,
  label,
  ...props
}: AssetsDonutProps) => {
  const chart = useChart({ data });

  return (
    <Chart.Root chart={chart} {...props}>
      <PieChart {...pieChartProps}>
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip hideLabel />}
          {...tooltipProps}
        />

        <Pie
          innerRadius={80}
          outerRadius={100}
          isAnimationActive={false}
          data={chart.data}
          dataKey={chart.key('value')}
          nameKey="label"
          paddingAngle={4}
          stroke="none"
          {...pieProps}
        >
          {label && <Label content={label} />}
          {chart.data.map((item) => (
            <Cell key={item.label} fill={chart.color(item.color)} />
          ))}
        </Pie>
      </PieChart>
    </Chart.Root>
  );
};

export default memo(AssetsDonut);
