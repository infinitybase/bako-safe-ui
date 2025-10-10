import {
  Avatar,
  Box,
  Heading,
  HStack,
  Icon,
  Separator,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';

import { Card } from '@/components';
import { useScreenSize } from '@/modules/core/hooks';
type ConnectorType = {
  name: string;
  label: string;
  icon?: React.ElementType;
  imageUrl?: string;
  isEnabled?: boolean;
};

interface CardConnectorProps {
  connector: ConnectorType;
  onClick: (connector: string) => void;
  isAnyWalletConnectorOpen: boolean;
}

interface ConnectorsListProps {
  hidden?: boolean;
  connectors: ConnectorType[];
  onConnectorSelect: (connector: string) => Promise<void>;
  isAnyWalletConnectorOpen: boolean;
}

const CardConnector = (props: CardConnectorProps) => {
  const { connector, isAnyWalletConnectorOpen, onClick } = props;

  const ConnectorIcon = useMemo(() => {
    if (connector.imageUrl) {
      return (
        <Avatar.Root color="white" w={9} bgColor="transparent" shape="rounded">
          <Avatar.Fallback name={connector.name} />
          <Avatar.Image src={connector.imageUrl} />
        </Avatar.Root>
      );
    }

    if (connector.icon) {
      return <Icon as={connector.icon} w={9} />;
    }

    return null;
  }, [connector]);

  const selectConnector = useCallback(() => {
    if (!connector.isEnabled) return;
    onClick(connector.name);
  }, [connector.isEnabled, connector.name, onClick]);

  return (
    <Card
      as={HStack}
      w="100%"
      h="100%"
      gap={4}
      justifyContent="space-between"
      p={2}
      aria-label={`Connect ${connector.label}`}
      cursor={connector.isEnabled ? 'pointer' : 'initial'}
      bgColor="grey.825"
      borderColor="grey.550"
      onClick={selectConnector}
      position="relative"
      transition="0.5s"
      pointerEvents={isAnyWalletConnectorOpen ? 'none' : 'auto'}
      _hover={{
        borderColor: 'grey.75',
      }}
    >
      <Box
        w="full"
        h="full"
        top={0}
        left={0}
        hidden={connector.isEnabled}
        position="absolute"
        borderRadius={10}
        backgroundColor="#121212a8"
      />
      {ConnectorIcon}
      <Box flex={1}>
        <Heading
          fontSize="sm"
          fontWeight="semibold"
          color="grey.200"
          lineHeight={1.2}
        >
          {connector.label}
        </Heading>
      </Box>
    </Card>
  );
};

const ConnectorsList = ({
  hidden,
  connectors,
  onConnectorSelect,
  isAnyWalletConnectorOpen,
}: ConnectorsListProps) => {
  const { isLitteSmall } = useScreenSize();

  return (
    <VStack hidden={hidden} gap={{ base: 6, md: 8 }} w="full">
      <HStack w="full" gap={5}>
        <Separator borderColor="grey.500" />
        <Text color="grey.250" fontSize="xs" fontWeight="light">
          OR
        </Text>
        <Separator borderColor="grey.500" />
      </HStack>

      <Stack flexDirection={isLitteSmall ? 'column' : 'row'} w="full" gap={2}>
        {connectors.map((connector) => (
          <CardConnector
            isAnyWalletConnectorOpen={isAnyWalletConnectorOpen}
            key={connector.name}
            connector={connector}
            onClick={onConnectorSelect}
          />
        ))}
      </Stack>
    </VStack>
  );
};

export { CardConnector, ConnectorsList };
