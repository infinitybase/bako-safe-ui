import {
  Avatar,
  Card,
  CardProps,
  Divider,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Nullable } from "@/modules/core";

interface DappRequestingFromProps extends CardProps {
  name: Nullable<string>;
  origin: Nullable<string>;
}

const DappRequestingFrom = (props: DappRequestingFromProps) => {
  const { name, origin, ...rest } = props;

  return (
    <Card
      {...rest}
      bgColor="dark.500"
      borderColor="grey.925"
      borderRadius={8}
      p={4}
      borderWidth="1px"
      w="full"
    >
      <Text fontSize={12} color="grey.550">
        Requesting a transaction from:
      </Text>

      <Divider borderColor="grey.950" my={3} />

      <HStack width="100%" spacing={3.5}>
        <Avatar
          variant="roundedSquare"
          color="white"
          bgColor="dark.950"
          size="sm"
          borderRadius="6.4px"
          name={name!}
        />
        <VStack alignItems="flex-start" spacing={0}>
          <Text color="grey.250" fontSize="sm" fontWeight="semibold">
            {name}
          </Text>
          <Text color="brand.500" fontSize="xs" lineHeight={4}>
            {origin?.split("//")[1]}
            {/* fuel-connectors-hx60ddh96-fuel-labs.vercel.app */}
          </Text>
        </VStack>
      </HStack>
    </Card>
  );
};

export { DappRequestingFrom };
