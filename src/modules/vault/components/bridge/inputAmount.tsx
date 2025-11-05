import { Box, InputGroup } from 'bako-ui';
import { memo, useCallback, useMemo, useRef } from 'react';

import { CurrencyField } from '@/components';
import { formatMaxDecimals } from '@/utils';

import { calculateTextWidth } from '../../utils';

const InputAmountComponent = ({
  symbol,
  value,
  disabled,
  onChange,
  decimals,
}: {
  symbol: string;
  value: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  decimals?: number;
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
          decimalScale={decimals}
        />
      </InputGroup>
    </Box>
  );
};

InputAmountComponent.displayName = 'InputAmount';

export const InputAmount = memo(InputAmountComponent);
