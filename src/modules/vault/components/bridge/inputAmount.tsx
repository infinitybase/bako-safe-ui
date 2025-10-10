import { Box, InputGroup } from '@chakra-ui/react';
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
  const [inputWidth, setInputWidth] = useState(50);

  useEffect(() => {
    if (mirrorRef.current) {
      const mirrorWidth = mirrorRef.current.offsetWidth;
      setInputWidth(mirrorWidth + 13);
    }
  }, [value]);

  return (
    <Box marginY={4} display="flex" justifyContent="center" alignItems="center">
      <InputGroup
        alignItems="center"
        justifyContent="center"
        borderBottom="1px solid"
        borderColor="grey.950"
        _hover={{
          borderColor: 'grey.200',
        }}
        px={0}
        minW="150px"
        w="fit-content"
      >
        <CurrencyField
          type="crypto"
          textAlign="center"
          borderBottomWidth="0"
          minW={0}
          px={0}
          fontSize="3xl"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e)}
          width={`${inputWidth}px`}
        />

        <Box
          ref={mirrorRef}
          position="absolute"
          visibility="hidden"
          whiteSpace="pre"
          fontSize="3xl"
          px={0}
        >
          {formatMaxDecimals(value, 9) || '0'}
        </Box>

        <Box
          alignSelf="end"
          color={disabled ? 'grey.75' : 'section.200'}
          opacity={disabled ? 0.5 : 1}
        >
          {symbol}
        </Box>
      </InputGroup>
    </Box>
  );
};
