import {
  Avatar,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FuelWalletConnector } from '@fuel-wallet/types';
import React, { useMemo } from 'react';

import { Card, ErrorIcon, FueletIcon, FuelIcon } from '@/components';

interface DrawerConnectorProps extends Pick<DrawerProps, 'isOpen' | 'onClose'> {
  connectors: FuelWalletConnector[];
  onSelect: (connector: string) => void;
}

interface ConnectorCardProps {
  connector: FuelWalletConnector;
  onClick: (connector: string) => void;
}

const connectorIcons = {
  'Fuel Wallet': FuelIcon,
  'Fuelet Wallet': FueletIcon,
};

const CardConnector = (props: ConnectorCardProps) => {
  const { connector, onClick } = props;

  const ConnectorIcon = useMemo(() => {
    const icon = connectorIcons[connector.name];

    if (connector.imageUrl) {
      return (
        <Avatar
          color="white"
          size="sm"
          bgColor="transparent"
          variant="roundedSquare"
          src={connector.imageUrl}
          name={connector.name}
        />
      );
    }

    if (icon) {
      return <Icon as={icon} fontSize="4xl" />;
    }

    return null;
  }, [connector]);

  return (
    <Card
      as={HStack}
      w="100%"
      gap={4}
      cursor="pointer"
      bgColor="dark.300"
      onClick={() => onClick(connector.name)}
    >
      {ConnectorIcon}
      <Heading fontSize="lg" fontWeight="semibold" color="grey.200">
        {connector.name}
      </Heading>
    </Card>
  );
};

const DrawerConnector = (props: DrawerConnectorProps) => {
  const { connectors, onSelect, ...drawerProps } = props;

  return (
    <Drawer {...drawerProps} size="sm" variant="glassmorphic" placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={drawerProps.onClose} spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>

        <DrawerHeader mb={10}>
          <VStack alignItems="flex-start" spacing={5}>
            <Heading fontSize="xl" fontWeight="semibold" color="grey.200">
              Connect your Wallet
            </Heading>
          </VStack>
        </DrawerHeader>

        <Divider borderColor="dark.100" mb={8} />

        <DrawerBody>
          <VStack spacing={4}>
            {connectors.map((connector) => (
              <CardConnector
                key={connector.name}
                connector={connector}
                onClick={onSelect}
              />
            ))}
          </VStack>
        </DrawerBody>

        <DrawerFooter justifyContent="flex-start">
          <VStack alignItems="flex-start">
            <Heading fontSize="md" fontWeight="semibold" color="grey.200">
              New to Fuel network?
            </Heading>
            <Text variant="description">
              Fuel is the {`world's`} fastest modular execution layer.
            </Text>
            <Link
              fontSize="xs"
              color="brand.500"
              href="https://www.fuel.network/"
              target="_blank"
            >
              Learn more about Fuel
            </Link>
          </VStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export { DrawerConnector };
