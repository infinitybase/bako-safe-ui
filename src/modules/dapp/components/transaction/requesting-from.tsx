import {
  Card,
  CardProps,
  Divider,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Nullable } from '@/modules/core';

interface DappRequestingFromProps extends CardProps {
  name: Nullable<string>;
  origin: Nullable<string>;
}

const DappRequestingFrom = (props: DappRequestingFromProps) => {
  const { name, origin, ...rest } = props;

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
        Requesting from:
      </Text>

      <Divider borderColor="grey.950" my={1} />

      <HStack width="100%" spacing={3.5}>
        <VStack alignItems="flex-start" spacing={0.5}>
          <Text color="grey.250" fontSize={12} fontWeight={500}>
            <Text as="span" color="white">
              {name}
            </Text>{' '}
            {origin?.split('//')[1]}
          </Text>
        </VStack>
      </HStack>
    </Card>
  );
};

export { DappRequestingFrom };
