import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import { CustomSkeleton, ErrorIcon } from '@/components';

import { VaultDrawerBox } from './box';
import { useVaultDrawer } from './hook';

interface VaultDrawerProps extends Omit<DrawerProps, 'children'> {
  vaultId: string;
  onSelect?: (vaultId: string) => void;
}

const VaultDrawer = ({ vaultId, ...props }: VaultDrawerProps) => {
  const {
    drawer,
    search,
    request: { vaults, isSuccess, isLoading, isFetching },
    inView,
  } = useVaultDrawer({
    onClose: props.onClose,
    isOpen: props.isOpen,
    onSelect: props.onSelect,
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
              Select a vault to go to the home page. You can search for a
              specific vault by name.
            </Text>
          </VStack>
        </DrawerHeader>

        <Box w="100%" mb={8}>
          <FormControl>
            <Input
              placeholder=" "
              variant="custom"
              colorScheme="dark"
              onChange={search.handler}
            />
            <FormLabel>Search</FormLabel>
            {/* It is important that the Label comes after the Control due to css selectors */}
          </FormControl>
        </Box>

        <DrawerBody
          py={8}
          borderTop="1px"
          borderTopColor="dark.100"
          css={{ '::-webkit-scrollbar': { width: 0 }, scrollbarWidth: 'none' }}
        >
          {isSuccess && !vaults.length && (
            <Text variant="variant">
              We {"couldn't"} find any results for <b>“{search.value}”</b> in
              the vault.
            </Text>
          )}
          <VStack spacing={4}>
            {!vaults.length && isFetching && (
              <CustomSkeleton h="90px" w="full" />
            )}
            {vaults?.map((vault) => (
              <CustomSkeleton key={vault.id} isLoaded={!isLoading}>
                <VaultDrawerBox
                  name={vault.name}
                  address={vault.predicateAddress}
                  isActive={vaultId === vault.id}
                  description={vault.description}
                  onClick={() => drawer.onSelectVault(vault.id)}
                />
              </CustomSkeleton>
            ))}
            <Box ref={inView.ref} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { VaultDrawer };
