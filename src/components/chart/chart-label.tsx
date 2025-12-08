import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';
import { PolarViewBoxRequired, ViewBox } from 'recharts/types/util/types';

interface ChartLabelProps {
  viewBox: ViewBox | undefined;
  title: string;
  label?: string;
  percentage?: number;
  fontSize?: number;
  padding?: number;
  legendHeight?: number;
}

const isPolarViewBox = (viewBox: ViewBox): viewBox is PolarViewBoxRequired =>
  'cx' in viewBox && 'cy' in viewBox;

export const ChartLabel = memo((props: ChartLabelProps) => {
  const {
    viewBox,
    title,
    label,
    percentage,
    fontSize = 14,
    padding = 12,
    legendHeight,
  } = props;

  if (!viewBox || !isPolarViewBox(viewBox)) return null;

  const viewBoxCy = legendHeight ? viewBox.cy - legendHeight / 2 : viewBox.cy;
  const hasActiveItem = label !== undefined && percentage !== undefined;
  const smallFontSize = fontSize * 0.85;
  const gap = 12;

  // Calculate text dimensions based on content
  let maxTextWidth = title.length * fontSize * 0.6;
  let totalHeight = fontSize;

  if (hasActiveItem) {
    const labelWidth = (label?.length || 0) * smallFontSize * 0.6;
    const percentageText = `${percentage.toFixed(0)}%`;
    const percentageWidth = percentageText.length * smallFontSize * 0.6;
    maxTextWidth = Math.max(maxTextWidth, labelWidth, percentageWidth);
    totalHeight = smallFontSize + gap + fontSize + gap + smallFontSize; // label + gap + title + gap + percentage
  }

  // Calculate rectangle dimensions and position
  const rectWidth = maxTextWidth + padding * 2;
  const rectHeight = totalHeight + padding * 2;
  const rectX = viewBox.cx - rectWidth / 2;
  const rectY = viewBoxCy - rectHeight / 2;

  return (
    <g>
      {/* Background rectangle with rounded corners */}
      <motion.rect
        rx={5}
        ry={5}
        fill="#2B2927"
        initial={false}
        animate={{
          x: rectX,
          y: rectY,
          width: rectWidth,
          height: rectHeight,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      />

      <AnimatePresence mode="wait">
        {hasActiveItem ? (
          <g key="active-items">
            {/* Asset Label */}
            <motion.text
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#A8A8A8"
              style={{
                fontSize: smallFontSize,
                fontWeight: 'normal',
              }}
              initial={{ opacity: 0, x: viewBox.cx, y: viewBoxCy }}
              animate={{
                opacity: 1,
                x: viewBox.cx,
                y: viewBoxCy - (fontSize / 2 + gap + smallFontSize / 2),
              }}
              exit={{ opacity: 0, x: viewBox.cx, y: viewBoxCy }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {label}
            </motion.text>
            {/* Value */}
            <motion.text
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#E6E6E6"
              style={{
                fontSize: fontSize,
                fontWeight: 'bold',
              }}
              initial={{ opacity: 0, x: viewBox.cx, y: viewBoxCy }}
              animate={{ x: viewBox.cx, y: viewBoxCy, opacity: 1 }}
              exit={{ opacity: 0, x: viewBox.cx, y: viewBoxCy }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {title}
            </motion.text>
            {/* Percentage */}
            <motion.text
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#A8A8A8"
              style={{
                fontSize: smallFontSize,
                fontWeight: 'normal',
              }}
              initial={{ opacity: 0, x: viewBox.cx, y: viewBoxCy }}
              animate={{
                opacity: 1,
                x: viewBox.cx,
                y: viewBoxCy + (fontSize / 2 + gap + smallFontSize / 2),
              }}
              exit={{ opacity: 0, x: viewBox.cx, y: viewBoxCy }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {percentage.toFixed(0)}%
            </motion.text>
          </g>
        ) : (
          /* Total only */
          <motion.text
            key="total-text"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#E6E6E6"
            style={{
              fontSize: fontSize,
              fontWeight: 'bold',
            }}
            initial={{ opacity: 0, x: viewBox.cx, y: viewBoxCy }}
            animate={{ x: viewBox.cx, y: viewBoxCy, opacity: 1 }}
            exit={{ opacity: 0, x: viewBox.cx, y: viewBoxCy }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {title}
          </motion.text>
        )}
      </AnimatePresence>
    </g>
  );
});

ChartLabel.displayName = 'ChartLabel';
