import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Card, ErrorIcon } from '@/components';

const VaultDrawerBox = () => {
  return (
    <Card bgColor="dark.300" w="100%">
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

const VaultDrawer = () => {
  return (
    <Drawer
      size="sm"
      isOpen={true}
      variant="glassmorphic"
      placement="left"
      onClose={console.log}
    >
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack spacing={2}>
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
            <Text variant="description">
              Setting Sail on a Journey to Unlock the Potential of User-Centered
              Design.
            </Text>
          </VStack>
        </DrawerHeader>

        <Box w="100%" mb={8}>
          <Input placeholder="Search" variant="custom" colorScheme="dark" />
        </Box>

        <DrawerBody py={8} borderTop="1px" borderTopColor="dark.100">
          <VStack>
            <VaultDrawerBox />
            <VaultDrawerBox />
            <VaultDrawerBox />
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
