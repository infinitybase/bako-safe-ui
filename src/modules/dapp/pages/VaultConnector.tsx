import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { RiLink } from 'react-icons/ri';

import { CustomSkeleton, ErrorIcon } from '@/components';
import { useQueryParams } from '@/modules/auth';
import { VaultDrawerBox } from '@/modules/vault/components/drawer/box';
import { useVaultDrawer } from '@/modules/vault/components/drawer/hook';

import { useAuthSocket } from '../hooks';

const VaultConnector = () => {
  const { name, origin } = useQueryParams();

  const {
    search,
    request: { vaults, isSuccess, isLoading, isFetching },
    inView,
  } = useVaultDrawer({});

  const {
    emitEvent,
    selectedVaultId,
    setSelectedVaultId,
    currentVault,
    emittingEvent,
  } = useAuthSocket();

  return (
    <Flex h="100vh" w="full">
      <Box w={420} px={10} pt={10}>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={() => window.close()} spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>

        <VStack alignItems="flex-start" mb={5}>
          <Heading fontSize="xl" fontWeight="semibold" color="grey.200">
            Select a vault
          </Heading>
          <Text maxWidth={300} variant="description">
            Select a vault. You can search for a specific vault by name.
          </Text>
        </VStack>

        {/* Requester */}
        <Card
          bgColor="dark.300"
          borderColor="dark.100"
          borderRadius={10}
          px={5}
          py={4}
          borderWidth="1px"
        >
          <Text fontSize="sm" color="grey.500">
            Requesting a transaction from:
          </Text>

          <Divider borderColor="dark.100" mt={3} mb={5} />

          <HStack width="100%" alignItems="center" spacing={4}>
            <Avatar
              variant="roundedSquare"
              color="white"
              bgColor="dark.150"
              name={name!}
            />
            <VStack alignItems="flex-start" spacing={0}>
              <Text variant="subtitle">{name}</Text>
              <Text color="brand.500" variant="description">
                {origin?.split('//')[1]}
              </Text>
            </VStack>
          </HStack>
        </Card>

        <Divider borderColor="dark.100" my={6} />

        {/* Search */}
        <Box w="full" mb={8}>
          <FormControl>
            <Input
              placeholder=" "
              variant="custom"
              colorScheme="dark"
              onChange={(e) => {
                setSelectedVaultId('');
                search.handler(e);
              }}
            />
            <FormLabel>Search</FormLabel>
            {/* It is important that the Label comes after the Control due to css selectors */}
          </FormControl>
        </Box>

        {isSuccess && !isFetching && !vaults.length && (
          <Text variant="variant">
            We {"couldn't"} find any results for <b>“{search.value}”</b> in the
            vault.
          </Text>
        )}

        {/* Result */}
        <VStack
          w="full"
          maxH={460}
          spacing={4}
          overflowY="scroll"
          css={{
            '&::-webkit-scrollbar': { width: '0' },
            scrollbarWidth: 'none',
          }}
        >
          {!vaults.length && isFetching && (
            <CustomSkeleton h="120px" w="full" />
          )}

          {vaults?.map(({ id, name, predicateAddress, description }) => {
            if (id === currentVault && !selectedVaultId) setSelectedVaultId(id);

            return (
              <VaultDrawerBox
                key={id}
                name={name}
                address={predicateAddress}
                isActive={selectedVaultId === id}
                description={description ?? ''}
                onClick={() => setSelectedVaultId(id)}
              />
            );
          })}

          {isFetching && vaults.length && (
            <Flex justifyContent="center" alignItems="center">
              <Spinner color="brand.500" size="md" />
            </Flex>
          )}

          <Box ref={inView.ref} />
        </VStack>

        <Divider borderColor="dark.100" my={6} />

        <HStack w="full" justifyContent="center" pb={10}>
          <Button
            variant="secondary"
            bgColor="dark.100"
            border="none"
            onClick={() => window.close()}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            isDisabled={!selectedVaultId || !vaults.length || isLoading}
            leftIcon={<RiLink size={22} />}
            onClick={() => emitEvent(selectedVaultId)}
            isLoading={emittingEvent}
          >
            Connect
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};

export { VaultConnector };
