import {
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
import React from 'react';

import { Card, ErrorIcon, FueletIcon, FuelIcon } from '@/components';

interface DrawerConnector extends Pick<DrawerProps, 'isOpen' | 'onClose'> {
  connectors: [];
  onSelect: () => void;
}

const DrawerConnector = (props: DrawerConnector) => {
  const { ...drawerProps } = props;

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
            <Card
              as={HStack}
              gap={4}
              w="100%"
              bgColor="dark.300"
              cursor="pointer"
            >
              <Icon as={FuelIcon} fontSize="4xl" />
              <Heading fontSize="lg" fontWeight="semibold" color="grey.200">
                Fuel Wallet
              </Heading>
            </Card>
            <Card
              as={HStack}
              gap={4}
              w="100%"
              bgColor="dark.300"
              cursor="pointer"
            >
              <Icon as={FueletIcon} fontSize="4xl" />
              <Heading fontSize="lg" fontWeight="semibold" color="grey.200">
                Fuelet
              </Heading>
            </Card>
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
            <Link color="brand.500" fontSize="xs" onClick={console.log}>
              Learn more about Fuel
            </Link>
          </VStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export { DrawerConnector };
