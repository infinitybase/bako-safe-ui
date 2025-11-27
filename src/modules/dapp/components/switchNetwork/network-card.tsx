import { HStack, Text, VStack } from 'bako-ui';
import { JSX } from 'react';

interface DappNetworkCardProps {
  icon: JSX.Element;
  name: string;
  url: string;
}

const DappNetworkCard = (props: DappNetworkCardProps) => {
  const { icon, name, url } = props;

  return (
    <HStack
      w="full"
      alignItems="center"
      bg="gray.700"
      borderRadius={8}
      p={4}
      gap={3}
    >
      {icon}

      <VStack alignItems="flex-start" gap={2}>
        <Text
          fontSize="xs"
          fontWeight={500}
          color="gray.50"
          lineHeight="12px"
          verticalAlign="middle"
        >
          {name}
        </Text>

        <Text fontSize="xs" fontWeight={400} color="gray.400" lineHeight="12px">
          {url}
        </Text>
      </VStack>
    </HStack>
  );
};

export { DappNetworkCard };
