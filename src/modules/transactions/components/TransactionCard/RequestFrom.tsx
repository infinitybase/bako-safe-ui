import {
  Card,
  CardProps,
  ComponentWithAs,
  Divider,
  HStack,
  Icon,
  IconProps,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Nullable } from '@/modules/core';

interface TransactionRequestFromProps extends CardProps {
  name: Nullable<string>;
  origin: Nullable<string>;
  icon?: ComponentWithAs<'svg', IconProps>;
}

const TransactionRequestFrom = (props: TransactionRequestFromProps) => {
  const { name, origin, icon, ...rest } = props;

  return (
    <Card
      {...rest}
      bgColor="grey.825"
      borderColor="grey.925"
      borderRadius={8}
      p={2}
      borderWidth="1px"
      w="full"
    >
      <Text fontSize={10} color="grey.425" fontWeight={400}>
        Requesting a transaction from:
      </Text>

      <Divider borderColor="grey.950" my={1} />

      <HStack width="100%" spacing={3.5}>
        {icon && <Icon as={icon} fontSize={28} />}
        <VStack alignItems="flex-start" spacing={0.5}>
          <Text color="grey.250" fontSize={12} fontWeight={500}>
            {name}
          </Text>
          <Text color="brand.500" fontSize={12} fontWeight={400} lineHeight={4}>
            {origin?.split('//')[1]}
          </Text>
        </VStack>
      </HStack>
    </Card>
  );
};

export { TransactionRequestFrom };
