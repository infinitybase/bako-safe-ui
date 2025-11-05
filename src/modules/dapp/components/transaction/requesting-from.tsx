import { Flex, FlexProps, HStack, Text, VStack } from 'bako-ui';

import { Nullable } from '@/modules/core';

interface DappRequestingFromProps extends FlexProps {
  name: Nullable<string>;
  origin: Nullable<string>;
  icon?: React.ReactNode;
}

const DappRequestingFrom = (props: DappRequestingFromProps) => {
  const { name, origin, icon, ...rest } = props;

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      bg="gray.550"
      borderRadius="8px"
      p={3}
      w="full"
      {...rest}
    >
      <HStack gap={3} align="center">
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
    </Flex>
  );
};

export { DappRequestingFrom };
