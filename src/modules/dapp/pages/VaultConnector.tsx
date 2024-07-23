import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RiLink } from 'react-icons/ri';

import { CustomSkeleton, EmptyBox, LineCloseIcon } from '@/components';
import { useAuth, useQueryParams } from '@/modules/auth';
import { AddressUtils, PermissionRoles } from '@/modules/core';
import { CreateVaultDialog } from '@/modules/vault';
import { VaultDrawerBox } from '@/modules/vault/components/drawer/box';
import { useVaultDrawer } from '@/modules/vault/components/drawer/hook';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';

import { useAuthSocket, useVerifyBrowserType } from '../hooks';

const VaultConnector = () => {
  const { name, origin, sessionId, request_id } = useQueryParams();
  const [noVaultOnFirstLoad, setNoVaultOnFirstLoad] = useState(true);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const auth = useAuth();
  const { isSafariBrowser } = useVerifyBrowserType();

  const {
    search,
    request: { vaults, isSuccess, isLoading, isFetching },
    inView,
  } = useVaultDrawer({});

  const { selectedVaultId, setSelectedVaultId, currentVault, send } =
    useAuthSocket();

  useEffect(() => {
    if (vaults.length && noVaultOnFirstLoad) {
      setNoVaultOnFirstLoad(false);
    }
  }, [vaults.length]);

  const noVaultsFound = search.value.length >= 1 && !vaults.length;
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    const clientWindowHeight = window.innerHeight;
    const dividedBy = clientWindowHeight >= 750 ? 2.1 : 2.5;

    setDynamicHeight(clientWindowHeight / dividedBy);
  }, []);

  return (
    <Flex h="100vh" w="full" overflow="hidden" bgColor="dark.950">
      <CreateVaultDialog isOpen={isOpen} onClose={onClose} />

      <Box w={420} px={8} pt={6}>
        <HStack
          spacing={2}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <VStack alignItems="flex-start">
            <Heading fontSize="xl" fontWeight="semibold" color="grey.200">
              Select a vault
            </Heading>
            <Text maxWidth={300} variant="description" fontSize={12}>
              {/* Select a vault. You can search for a specific vault by name. */}
              You can search for a specific vault by name
            </Text>
          </VStack>

          {isSafariBrowser && (
            <LineCloseIcon
              mr={2}
              onClick={() => window.close()}
              cursor="pointer"
              fontSize="24px"
              aria-label="Close window"
            />
          )}
        </HStack>

        <Divider borderColor="dark.100" my={4} />

        {/* Requester */}
        <Card h={106} gap={4} bg="transparent" mb={6}>
          <Text fontSize={12} color="grey.50" fontWeight={700}>
            Requesting a transaction from:
          </Text>
          <Card
            bgColor="grey.825"
            borderColor="dark.100"
            borderRadius={8}
            p={4}
            borderWidth="1px"
            height={24}
          >
            <HStack width="100%" spacing={4} h="49px">
              <Avatar
                variant="roundedSquare"
                color="white"
                bgColor="dark.950"
                boxSize={10}
                name={name!}
              />
              <VStack alignItems="flex-start" spacing={0}>
                <Text variant="subtitle">{name}</Text>
                <Text color="brand.500" variant="description" lineHeight={4}>
                  {origin?.split('//')[1]}
                  {/* fuel-connectors-hx60ddh96-fuel-labs.vercel.app */}
                </Text>
              </VStack>
            </HStack>
          </Card>
        </Card>

        {/* Search */}
        {!noVaultOnFirstLoad && (
          <CustomSkeleton isLoaded={noVaultsFound || !isLoading}>
            <Box w="full" mb={8}>
              <FormControl
                sx={{
                  '&>input': {
                    bg: 'grey.825',
                  },
                  '&>label': {
                    color: 'grey.75',
                  },
                }}
              >
                <Input
                  placeholder=" "
                  variant="custom"
                  colorScheme="dark"
                  onChange={(e) => {
                    setSelectedVaultId('');
                    search.handler(e);
                  }}
                />
                <Box>
                  <FormLabel fontWeight="normal">Search vault</FormLabel>
                </Box>
                {noVaultsFound && (
                  <FormHelperText color="grey.250" mb={-6}>
                    {`We couldn't find any results for "${AddressUtils.format(
                      search.value,
                      1,
                    )}"`}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </CustomSkeleton>
        )}

        <CustomSkeleton h={450} isLoaded={noVaultsFound || !isLoading}>
          {isSuccess && !isFetching && noVaultOnFirstLoad && (
            <VStack>
              <Card
                w="full"
                bgColor="transparent"
                display="flex"
                borderWidth={1}
                borderColor="grey.300"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                h={224}
                my={10}
              >
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  bg="linear-gradient(132.19deg, rgba(255, 192, 16, 0.1) 0%, rgba(235, 163, 18, 0.1) 48%, rgba(211, 128, 21, 0.1) 71%, rgba(178, 79, 24, 0.1) 99%);"
                  rounded={10}
                  w="57px"
                  h="56px"
                >
                  <EmptyBox w="33px" h="33px" />
                </Flex>
                <Flex
                  w={305}
                  alignItems="center"
                  flexDir="column"
                  gap={6}
                  mt={4}
                >
                  <Heading color="grey.75" fontSize={20}>
                    Nothing to show here.
                  </Heading>
                  <Text
                    color="grey.450"
                    fontSize={12}
                    textAlign="center"
                    fontWeight="medium"
                  >
                    It seems like you {"haven't"} any Vault yet.
                  </Text>
                </Flex>
              </Card>
              <Button bg="grey.75" fontSize={14} onClick={onOpen} w="full">
                Create new Vault
              </Button>
            </VStack>
          )}
          {!noVaultOnFirstLoad ? <Divider borderColor="grey.75" /> : null}
          {/* Result */}
          <VStack
            pt={4}
            w="full"
            h={noVaultOnFirstLoad ? 140 : `${dynamicHeight}px`}
            spacing={2}
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': { width: '0' },
              scrollbarWidth: 'none',
            }}
          >
            {vaults?.map(({ id, name, predicateAddress, workspace }) => {
              const isViewer = WorkspacePermissionUtils.is(
                PermissionRoles.VIEWER,
                {
                  permissions: workspace.permissions,
                  userId: auth.userId,
                },
              );

              if (isViewer) return null;

              if (id === currentVault && !selectedVaultId)
                setSelectedVaultId(id);

              return (
                <VaultDrawerBox
                  key={id}
                  name={name}
                  workspace={workspace}
                  address={predicateAddress}
                  isActive={selectedVaultId === id}
                  isSingleWorkspace={workspace.single}
                  onClick={() => setSelectedVaultId(id)}
                  isInDapp
                />
              );
            })}

            {isFetching && vaults.length && (
              <Flex justifyContent="center" alignItems="center">
                <Spinner color="brand.500" size="md" />
              </Flex>
            )}

            {/* Normally, it's a self closing box (<Box/>) but due the dynamic height using window.height */}
            {/* it's necessary to render it this way */}
            <Box ref={inView.ref} color="transparent">
              ...
            </Box>
          </VStack>
          {!noVaultOnFirstLoad && <Divider borderColor="grey.75" mb={6} />}
          <HStack w="full" justifyContent="center" pb={10}>
            <Button
              variant="secondary"
              borderColor="grey.75"
              onClick={() => window.close()}
              w={noVaultOnFirstLoad ? 'full' : 'unset'}
            >
              Cancel
            </Button>

            {!noVaultOnFirstLoad && (
              <Button
                variant="primary"
                width="100%"
                fontWeight={700}
                fontSize={16}
                isDisabled={!selectedVaultId || !vaults.length || isLoading}
                leftIcon={<RiLink size={22} />}
                onClick={() =>
                  send.mutate({
                    name: name!,
                    origin: origin!,
                    sessionId: sessionId!,
                    request_id: request_id!,
                    vaultId: selectedVaultId,
                    userAddress: auth.account,
                  })
                }
                isLoading={send.isPending}
              >
                Connect
              </Button>
            )}
          </HStack>
        </CustomSkeleton>
      </Box>
    </Flex>
  );
};

export { VaultConnector };
