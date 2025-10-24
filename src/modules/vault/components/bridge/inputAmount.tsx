import { Box, InputGroup } from 'bako-ui';
import { memo, useCallback, useMemo, useRef } from 'react';

import { CurrencyField } from '@/components';
import { formatMaxDecimals } from '@/utils';

const CHAR_WIDTH_MAP = {
  '0': 20,
  '1': 12,
  '2': 20,
  '3': 20,
  '4': 20,
  '5': 20,
  '6': 20,
  '7': 20,
  '8': 20,
  '9': 20,
  '.': 10,
  ',': 10,
  ' ': 8,
} as const;

const MIN_WIDTH = 80;
const MIN_WIDTH_WITHOUT_VALUE = 150;
const SYMBOL_PADDING = 60;

const calculateTextWidth = (text: string): number => {
  // Fallback to '0.000' if text is empty
  const displayText = text || '0.000';

  let width = 0;
  for (let i = 0; i < displayText.length; i++) {
    const char = displayText[i] as keyof typeof CHAR_WIDTH_MAP;
    width += CHAR_WIDTH_MAP[char] || 20;
  }

  const min = text.length === 0 ? MIN_WIDTH_WITHOUT_VALUE : MIN_WIDTH;

  return Math.max(min, width + SYMBOL_PADDING);
};

const InputAmountComponent = ({
  symbol,
  value,
  disabled,
  onChange,
}: {
  symbol: string;
  value: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formattedValue = useMemo(() => {
    return formatMaxDecimals(value, 9) || '0.000';
  }, [value]);

  const width = useMemo(() => {
    return calculateTextWidth(formattedValue);
  }, [formattedValue]);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange?.(newValue);
    },
    [onChange],
  );

  return (
    <Box marginY={4} display="flex" alignItems="center" position="relative">
      <InputGroup
        alignItems="center"
        justifyContent="start"
        px={0}
        w={`${width}px`}
        border="none"
        transition="width 0.15s ease-out"
        endElementProps={{
          px: 0,
        }}
        endElement={
          <Box
            alignSelf="center"
            letterSpacing="wider"
            color="gray.400"
            opacity={disabled ? 0.6 : 1}
            px={0}
          >
            {symbol}
          </Box>
        }
      >
        <CurrencyField
          ref={inputRef}
          type="crypto"
          bg="bg.panel"
          name="bridgeAmount"
          outline="none"
          border="none"
          color="gray.50"
          _selection={{
            bg: 'textSecondary',
          }}
          fontWeight="bold"
          letterSpacing="wider"
          minW={0}
          px={0}
          fontSize="3xl"
          disabled={disabled}
          value={value}
          placeholder="0.000"
          onChange={handleChange}
        />
      </InputGroup>
    </Box>
  );
};

InputAmountComponent.displayName = 'InputAmount';

export const InputAmount = memo(InputAmountComponent);
