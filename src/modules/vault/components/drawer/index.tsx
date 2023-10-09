import {
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

import { ErrorIcon } from '@/components';

import { VaultDrawerBox } from './box';
import { useVaultDrawer } from './hook';

interface VaultDrawerProps extends Omit<DrawerProps, 'children'> {
  vaultId: string;
}

const VaultDrawer = ({ vaultId, ...props }: VaultDrawerProps) => {
  const {
    drawer,
    search,
    request: { vaults },
    inView,
  } = useVaultDrawer({
    onClose: props.onClose,
    isOpen: props.isOpen,
  });

  return (
    <Drawer
      {...props}
      size="sm"
      onClose={drawer.onClose}
      variant="glassmorphic"
      placement="left"
    >
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={drawer.onClose} spacing={2}>
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
          <Input
            onChange={search}
            placeholder="Search"
            variant="custom"
            colorScheme="dark"
          />
        </Box>

        <DrawerBody py={8} borderTop="1px" borderTopColor="dark.100">
          <VStack spacing={4}>
            {vaults?.map((vault) => (
              <VaultDrawerBox
                key={vault.id}
                name={vault.name}
                address={vault.predicateAddress}
                isActive={vaultId === vault.id}
                description={vault.description}
                onClick={() => drawer.onSelectVault(vault.id)}
              />
            ))}
            <Box ref={inView.ref} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { VaultDrawer };
