import {
  Avatar,
  Box,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from 'bako-ui';
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
        <Avatar
          color="white"
          boxSize="16px"
          bgColor="transparent"
          shape="rounded"
          name={connector.name}
          src={connector.imageUrl}
        />
      );
    }

    if (connector.icon) {
      return <Icon as={connector.icon} boxSize="16px" />;
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
      gap={2}
      p={4}
      flexDirection="column"
      alignItems="center"
      aria-label={`Connect ${connector.label}`}
      cursor={connector.isEnabled ? 'pointer' : 'initial'}
      border="none"
      onClick={selectConnector}
      position="relative"
      transition="0.5s"
      pointerEvents={isAnyWalletConnectorOpen ? 'none' : 'auto'}
      _hover={{
        bg: 'gray.500',
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
        backgroundColor="#121212d7"
      />
      {ConnectorIcon}
      <Box flex={1}>
        <Heading
          fontSize="xs"
          fontWeight="semibold"
          color="gray.50"
          lineHeight={1.2}
          letterSpacing="wider"
          textTransform="uppercase"
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
    <VStack hidden={hidden} gap={{ base: 6, md: 8 }} w="full" px={6}>
      <HStack w="full" gap={5}>
        <Text color="gray.200" fontSize="sm" fontWeight="light">
          Or connect wallet
        </Text>
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
