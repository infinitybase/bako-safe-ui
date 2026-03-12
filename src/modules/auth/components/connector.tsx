import {
  Avatar,
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from 'bako-ui';
import React, { useCallback, useMemo } from 'react';

import { Card } from '@/components';
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
  isEnabled?: boolean;
}

interface ConnectorsListProps {
  hidden?: boolean;
  connectors: ConnectorType[];
  onConnectorSelect: (connector: string) => Promise<void>;
  isAnyWalletConnectorOpen: boolean;
}

const CardConnector = ({
  connector,
  onClick,
  isEnabled,
}: CardConnectorProps) => {
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
    if (!isEnabled) return;
    onClick(connector.name);
  }, [isEnabled, connector.name, onClick]);

  return (
    <Card
      as={HStack}
      w="100%"
      minW={100}
      h="100%"
      gap={2}
      py={4}
      px={{ base: 2, sm: 4 }}
      flexDirection="column"
      alignItems="center"
      aria-label={`Connect ${connector.label}`}
      cursor={isEnabled ? 'pointer' : 'not-allowed'}
      border="none"
      borderRadius={8}
      onClick={selectConnector}
      position="relative"
      transition="0.5s"
      pointerEvents="auto"
      _hover={{
        bg: 'gray.600',
      }}
    >
      <Box
        w="full"
        h="full"
        top={0}
        left={0}
        display={isEnabled ? 'none' : 'block'}
        position="absolute"
        borderRadius={10}
        backgroundColor="#121212d7"
      />
      {ConnectorIcon}
      <Box flex={1}>
        <Heading
          fontSize="2xs"
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
  return (
    <VStack hidden={hidden} gap={{ base: 6, sm: 8 }} w="full">
      <HStack w="full" gap={5}>
        <Text color="gray.200" fontSize="sm" fontWeight="light">
          Or connect wallet
        </Text>
      </HStack>

      <Grid gap={2} gridTemplateColumns="repeat(3, 1fr)" w="full">
        {connectors.map((connector) => (
          <GridItem key={connector.name}>
            <CardConnector
              connector={connector}
              onClick={onConnectorSelect}
              isEnabled={connector.isEnabled && !isAnyWalletConnectorOpen}
            />
          </GridItem>
        ))}
      </Grid>
    </VStack>
  );
};

export { CardConnector, ConnectorsList };
