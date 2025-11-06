import { HStack, HStackProps, Text, VStack } from 'bako-ui';

import { Nullable } from '@/modules/core';

interface DappRequestingFromProps extends HStackProps {
  name: Nullable<string>;
  origin: Nullable<string>;
  icon?: React.ReactNode;
}

const DappRequestingFrom = (props: DappRequestingFromProps) => {
  const { name, origin, icon, ...rest } = props;

  return (
    <HStack
      gap={3}
      align="center"
      bg="gray.550"
      borderRadius="8px"
      p={3}
      w="full"
      {...rest}
    >
      {icon && icon}
      <VStack gap={2} align="flex-start">
        <Text
          color="gray.100"
          fontSize={12}
          fontWeight={500}
          lineHeight="9px"
        >
          {name}
        </Text>
        <Text
          color="gray.300"
          fontSize={12}
          fontWeight={400}
          lineHeight="9px"
        >
          Requesting a transaction from: {origin?.split('//')[1]}
        </Text>
      </VStack>
    </HStack>
  );
};

export { DappRequestingFrom };
