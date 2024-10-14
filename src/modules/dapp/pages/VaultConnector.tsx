import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RiLink } from 'react-icons/ri';

import {
  BakoLoading,
  CustomSkeleton,
  EmptyBox,
  LineCloseIcon,
} from '@/components';
import { Container } from '@/layouts/dapp/container';
import { useQueryParams } from '@/modules/auth';
import { CreateVaultDialog } from '@/modules/vault';
import { VaultItemBox } from '@/modules/vault/components/modal/box';
import { useVaultDrawer } from '@/modules/vault/components/modal/hook';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { DappTransaction } from '../components';
import { useAuthSocket, useVerifyBrowserType } from '../hooks';

const VaultConnector = () => {
  const { name, origin, sessionId, request_id } = useQueryParams();
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [connectingManually, setConnectingManually] = useState(false);

  const {
    authDetails: { userInfos, handlers },
  } = useWorkspaceContext();
  const { isSafariBrowser } = useVerifyBrowserType();

  const {
    request: { vaults, isSuccess, isLoading, isFetching },
    inView,
  } = useVaultDrawer({ perPage: 10, orderByRoot: true });

  const { selectedVaultId, setSelectedVaultId, currentVault, send } =
    useAuthSocket();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const noVaultsAvailable = isSuccess && !vaults.length;

  useEffect(() => {
    if (
      vaults.length === 1 &&
      vaults[0]?.id &&
      !send.isPending &&
      name &&
      origin &&
      sessionId &&
      request_id &&
      userInfos.address
    ) {
      send.mutate({
        name: name,
        origin: origin,
        sessionId: sessionId,
        request_id: request_id,
        vaultId: vaults[0].id,
        userAddress: userInfos.address,
      });
    }
  }, [
    // name,
    // origin,
    // sessionId,
    // request_id,
    userInfos.address,
    vaults.length,
    // send,
  ]);

  useEffect(() => {
    const clientWindowHeight = window.innerHeight;
    const dividedBy = clientWindowHeight >= 750 ? 1.26 : 1.38;

    setDynamicHeight(clientWindowHeight / dividedBy);
  }, []);

  if (isLoading || (send.isPending && !connectingManually)) {
    return <BakoLoading />;
  }

  return (
    <Container>
      <Flex h="100vh" w="full" overflow="hidden" bgColor="dark.950">
        <CreateVaultDialog isOpen={isOpen} onClose={onClose} />

        <Box w={420} px={8} pt={6}>
          <HStack
            spacing={2}
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Heading fontSize="md" fontWeight="semibold" color="grey.200">
              Select vault
            </Heading>

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

          <Divider borderColor="grey.425" mt={4} />

          <CustomSkeleton h={564} isLoaded={!isLoading} mt={isLoading ? 4 : 0}>
            {/* Result */}
            <VStack
              w="full"
              h={noVaultsAvailable ? 140 : `${dynamicHeight}px`}
              pt={4}
              spacing={2}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': { width: '0' },
                scrollbarWidth: 'none',
              }}
            >
              <DappTransaction.RequestingFrom
                mb={2}
                name={name}
                origin={origin}
              />

              {vaults?.map((vault) => {
                if (!vault) return null;

                const { id, name, predicateAddress, workspace, members, root } =
                  vault;

                if (id === currentVault && !selectedVaultId)
                  setSelectedVaultId(id);

                if (id !== currentVault && !selectedVaultId && root)
                  setSelectedVaultId(id);

                return (
                  <VaultItemBox
                    key={id}
                    name={name}
                    workspace={workspace}
                    members={members?.length}
                    address={predicateAddress}
                    root={root}
                    isActive={selectedVaultId === id}
                    isSingleWorkspace={workspace.single}
                    onClick={() => setSelectedVaultId(id)}
                    isInDapp
                    mt={0}
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

            {/* No vaults */}
            {!isFetching && noVaultsAvailable && (
              <VStack mb={6}>
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

            {!noVaultsAvailable && <Divider borderColor="grey.425" mb={6} />}

            <HStack w="full" justifyContent="center" pb={10}>
              <Button
                variant="secondary"
                borderColor="grey.75"
                onClick={() => {
                  handlers.logout?.(true, window.close);
                }}
                w={noVaultsAvailable ? 'full' : 'unset'}
              >
                Cancel
              </Button>

              {!noVaultsAvailable && (
                <Button
                  variant="primary"
                  width="100%"
                  fontWeight={700}
                  fontSize={16}
                  isDisabled={
                    !selectedVaultId ||
                    !vaults.length ||
                    isLoading ||
                    send.isPending
                  }
                  leftIcon={<RiLink size={22} />}
                  onClick={() => {
                    setConnectingManually(true);
                    send.mutate(
                      {
                        name: name!,
                        origin: origin!,
                        sessionId: sessionId!,
                        request_id: request_id!,
                        vaultId: selectedVaultId,
                        userAddress: userInfos.address,
                      },
                      {
                        onError: () => {
                          setConnectingManually(false);
                        },
                      },
                    );
                  }}
                  isLoading={send.isPending}
                >
                  Connect
                </Button>
              )}
            </HStack>
          </CustomSkeleton>
        </Box>
      </Flex>
    </Container>
  );
};

export { VaultConnector };
