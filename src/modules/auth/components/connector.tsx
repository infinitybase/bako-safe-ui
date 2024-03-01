import {
  Avatar,
  Box,
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
import React, { useCallback, useMemo } from 'react';

import { Card } from '@/components';
import { CloseIcon } from '@/components/icons/close-icon';

type ConnectorType = {
  name: string;
  icon?: React.ElementType;
  imageUrl?: string;
  isEnabled?: boolean;
};

interface DrawerConnectorProps extends Pick<DrawerProps, 'isOpen' | 'onClose'> {
  connectors: ConnectorType[];
  onSelect: (connector: string) => void;
}

interface ConnectorCardProps {
  connector: ConnectorType;
  onClick: (connector: string) => void;
}

const CardConnector = (props: ConnectorCardProps) => {
  const { connector, onClick } = props;

  const ConnectorIcon = useMemo(() => {
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

    if (connector.icon) {
      return <Icon as={connector.icon} fontSize="4xl" />;
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
      gap={4}
      cursor={connector.isEnabled ? 'pointer' : 'initial'}
      bgColor="dark.600"
      onClick={selectConnector}
      position="relative"
      _hover={{
        borderColor: 'brand.500',
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
      <Heading
        fontSize={{ base: 'md', sm: 'lg' }}
        fontWeight="semibold"
        color="grey.200"
      >
        {connector.name}
      </Heading>
    </Card>
  );
};

const DrawerConnector = (props: DrawerConnectorProps) => {
  const { connectors, onSelect, ...drawerProps } = props;

  return (
    <Drawer
      {...drawerProps}
      size={{
        base: 'full',
        sm: 'sm',
      }}
      variant="solid"
      placement="right"
    >
      <DrawerOverlay />
      <DrawerContent maxH="full">
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack
            cursor="pointer"
            onClick={drawerProps.onClose}
            spacing={2}
            zIndex={1}
          >
            <Text color="grey.100">Close</Text>
            <CloseIcon />
          </HStack>
        </Flex>

        <DrawerHeader mt="-43px" mb={7}>
          <VStack alignItems="flex-start" spacing={5}>
            <Heading fontSize={{ base: 'lg', sm: 'xl' }} fontWeight="semibold">
              Connect your Wallet
            </Heading>
            <Text color="grey.100" fontSize="small" fontWeight="light">
              Personalize your preferences: set your name, email, and email
              notification preferences.
            </Text>
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

        <DrawerFooter justifyContent="flex-start" pl={0}>
          <VStack alignItems="flex-start">
            <Heading fontSize="md" fontWeight="semibold" color="grey.200">
              New to Fuel network?
            </Heading>
            <Text variant="description">
              Fuel is the {`world's`} fastest modular execution layer.
            </Text>
            <Link
              fontSize="xs"
              color="brand.400"
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
