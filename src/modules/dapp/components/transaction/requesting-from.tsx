import {
  Card,
  CardRootProps,
  HStack,
  Separator,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Nullable } from '@/modules/core';

interface DappRequestingFromProps extends CardRootProps {
  name: Nullable<string>;
  origin: Nullable<string>;
}

const DappRequestingFrom = (props: DappRequestingFromProps) => {
  const { name, origin, ...rest } = props;

  return (
    <Card.Root
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

      <Separator borderColor="grey.950" my={1} />

      <HStack width="100%" gap={3.5}>
        <VStack alignItems="flex-start" gap={0.5}>
          <Text color="grey.250" fontSize={12} fontWeight={500}>
            {name}
          </Text>
          <Text color="brand.500" fontSize={12} fontWeight={400} lineHeight={4}>
            {origin?.split('//')[1]}
            {/* fuel-connectors-hx60ddh96-fuel-labs.vercel.app */}
          </Text>
        </VStack>
      </HStack>
    </Card.Root>
  );
};

export { DappRequestingFrom };
