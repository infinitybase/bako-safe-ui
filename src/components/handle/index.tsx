import { HStack, Text, TextProps } from 'bako-ui';
import { useMemo } from 'react';

import { HandleUtils } from '@/utils/handle';

interface HandleProps extends TextProps {
  value: string;
  onClick?: () => void;
}

const Handle = (props: HandleProps) => {
  const { value, onClick, ...rest } = props;

  const _value = useMemo(() => HandleUtils.fromHandle(value), [value]);

  return (
    <HStack
      borderRadius="full"
      px={1.5}
      bgColor="bg.panel/50"
      gap={1}
      alignItems="center"
      justifyContent="center"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
    >
      <Text fontSize="xs" color="gray.200">
        @
      </Text>
      <Text fontSize="xs" color="textPrimary" {...rest}>
        {_value}
      </Text>
    </HStack>
  );
};

export { Handle };
