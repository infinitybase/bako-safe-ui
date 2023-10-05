import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Card, CardProps, ErrorIcon } from '@/components';

interface VaultDrawerBoxProps extends CardProps {
  isActive?: boolean;
}

const VaultDrawerBox = (props: VaultDrawerBoxProps) => {
  const { isActive, ...rest } = props;

  return (
    <Card
      {...rest}
      w="100%"
      bgColor="dark.300"
      cursor="pointer"
      borderColor={isActive ? 'brand.500' : 'dark.100'}
      borderWidth={isActive ? '2px' : '1px'}
    >
      <HStack width="100%" alignItems="center" spacing={4} mb={5}>
        <Avatar bgColor="dark.150" name="Infinitybase" />
        <VStack alignItems="flex-start" spacing={1}>
          <Text variant="subtitle">Infinitybase</Text>
          <Text variant="description">alskdjlaksdjlaksjd</Text>
        </VStack>
      </HStack>
      <Box>
        <Text variant="description">
          Setting Sail on a Journey to Unlock the Potential of User-Centered
          Design.
        </Text>
      </Box>
    </Card>
  );
};

interface VaultDrawerProps extends Omit<DrawerProps, 'children'> {}

const VaultDrawer = (props: VaultDrawerProps) => {
  return (
    <Drawer {...props} size="sm" variant="glassmorphic" placement="left">
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={props.onClose} spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>

        <DrawerHeader mb={10}>
          <VStack alignItems="flex-start" spacing={5}>
            <Heading fontSize="xl" fontWeight="semibold" color="grey.200">
              Vault
            </Heading>
            <Text maxWidth={300} variant="description">
              Setting Sail on a Journey to Unlock the Potential of User-Centered
              Design.
            </Text>
          </VStack>
        </DrawerHeader>

        <Box w="100%" mb={8}>
          <Input placeholder="Search" variant="custom" colorScheme="dark" />
        </Box>

        <DrawerBody py={8} borderTop="1px" borderTopColor="dark.100">
          <VStack spacing={4}>
            <VaultDrawerBox />
            <VaultDrawerBox />
            <VaultDrawerBox isActive />
            <VaultDrawerBox />
            <VaultDrawerBox />
            <VaultDrawerBox />
            <VaultDrawerBox />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { VaultDrawer };
