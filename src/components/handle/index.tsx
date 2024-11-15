import { HStack, Text, TextProps } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useScreenSize } from '@/modules/core/hooks';
import { HandleUtils } from '@/utils/handle';

interface HandleProps extends TextProps {
  value: string;
}

const Handle = ({ value, ...rest }: HandleProps) => {
  const { isLowerThanFourHundredAndThirty } = useScreenSize();

  const _value = useMemo(() => HandleUtils.fromHandle(value), [value]);

  return (
    <HStack
      borderRadius="full"
      px={1.5}
      bgColor="grey.925"
      spacing={1}
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="xs" color="grey.50">
        @
      </Text>
      <Text
        fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        color="grey.250"
        {...rest}
      >
        {_value}
      </Text>
    </HStack>
  );
};

export { Handle };
