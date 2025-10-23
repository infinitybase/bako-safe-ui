import { Box, InputGroup } from 'bako-ui';
import { useEffect, useRef, useState } from 'react';

import { CurrencyField } from '@/components';
import { formatMaxDecimals } from '@/utils';

export const InputAmount = ({
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
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(150);

  useEffect(() => {
    // Trigger re-render to calculate width
    if (mirrorRef.current) {
      const width = mirrorRef.current.offsetWidth;
      setWidth(width);
    }
  }, [value, setWidth]);

  return (
    <Box marginY={4} display="flex" alignItems="center">
      <InputGroup
        alignItems="center"
        justifyContent="start"
        px={0}
        minW="150px"
        w={`${width}px`}
        border="none"
        endElementProps={{
          px: 0,
        }}
        endElement={
          <Box
            alignSelf="center"
            color="gray.400"
            opacity={disabled ? 0.6 : 1}
            px={0}
          >
            {symbol}
          </Box>
        }
      >
        <CurrencyField
          type="crypto"
          name="bridgeAmount"
          outline="none"
          border="none"
          color="gray.50"
          minW={0}
          px={0}
          fontSize="3xl"
          disabled={disabled}
          value={value}
          placeholder="0.000"
          onChange={(e) => onChange?.(e)}
        />
      </InputGroup>
      <Box
        ref={mirrorRef}
        position="absolute"
        visibility="hidden"
        whiteSpace="pre"
        fontSize="3xl"
        px={0}
      >
        {formatMaxDecimals(value, 9) || '0.000'} {symbol}
      </Box>
    </Box>
  );
};
