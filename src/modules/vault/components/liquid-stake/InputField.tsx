import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

import { CurrencyField } from '@/components';
import { formatMaxDecimals } from '@/utils';

export const InputField = ({
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
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mirrorRef.current && ref?.current) {
      const mirrorWidth = mirrorRef.current.offsetWidth;
      // eslint-disable-next-line react-compiler/react-compiler
      ref.current.style.width = `${mirrorWidth}px`;
    }
  }, [value, ref]);

  return (
    <Box marginY={6} display="flex" justifyContent="center" alignItems="center">
      <Box
        position="relative"
        display="flex"
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
          ref={ref}
          value={value}
          onChange={(e) => onChange?.(e)}
          disabled={disabled}
        />

        <Box
          position="absolute"
          visibility="hidden"
          fontSize="3xl"
          px={2}
          ref={mirrorRef}
        >
          {formatMaxDecimals(value, 9) || '0'}
        </Box>

        <Box
          alignSelf="end"
          color={`${disabled ? 'grey.75' : 'section.200'}`}
          opacity={disabled ? 0.5 : 1}
          px={2}
        >
          {symbol}
        </Box>
      </Box>
    </Box>
  );
};
