import { useFuel } from '@fuels/react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Loader,
  Separator,
  Spacer,
  Text,
  VStack,
} from 'bako-ui';
import { AddressUtils as BakoAddressUtils } from 'bakosafe';
import { useEffect } from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';

import { CustomSkeleton, EmptyBox, LineCloseIcon } from '@/components';
import { useQueryParams } from '@/modules/auth';
import { TypeUser } from '@/modules/auth/services';
import { AddressUtils } from '@/modules/core';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { CreateVaultDialog } from '@/modules/vault';
import { VaultItemBox } from '@/modules/vault/components/modal/box';
import { useVaultDrawer } from '@/modules/vault/components/modal/hook';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { DappTransaction } from '../components';
import { useAuthSocket, useVerifyBrowserType } from '../hooks';

const VaultConnector = () => {
  const { name, origin, sessionId, request_id } = useQueryParams();
  // const [_, setDynamicHeight] = useState(0);

  const {
    authDetails: { userInfos, handlers },
  } = useWorkspaceContext();
  const { isSafariBrowser } = useVerifyBrowserType();

  const { fuel } = useFuel();

  const {
    request: { vaults, isSuccess, isLoading, isFetching },
    inView,
  } = useVaultDrawer({ perPage: 10, orderByRoot: true });

  const { selectedVaultId, setSelectedVaultId, currentVault, send } =
    useAuthSocket();

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const noVaultsAvailable = isSuccess && !vaults.length;

  const isWebAuthn = userInfos?.type.type === TypeUser.WEB_AUTHN;

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

  // useEffect(() => {
  //   const clientWindowHeight = window.innerHeight;
  //   const dividedBy = clientWindowHeight >= 750 ? 1.64 : 1.8;
  //   setDynamicHeight(clientWindowHeight / dividedBy);
  // }, []);

  const logout = async () => {
    try {
      userInfos?.type.type === TypeUser.FUEL &&
        userInfos?.type.name !== EConnectors.FULLET &&
        (await fuel.disconnect());
    } catch (error) {
      // eslint-disable-next-line no-empty
    } finally {
      handlers.logout?.();
    }
  };

  const getUserAddress = () => {
    if (BakoAddressUtils.isEvm(userInfos?.address)) {
      return AddressUtils.format(
        BakoAddressUtils.parseFuelAddressToEth(userInfos?.address),
        15,
      );
    }

    return isWebAuthn
      ? userInfos?.name
      : AddressUtils.format(userInfos?.address, 15);
  };

  return (
    <VStack
      w="full"
      h="$100vh"
      overflowX="hidden"
      css={{
        '&::-webkit-scrollbar': { width: '0' },
        scrollbarWidth: 'none',
      }}
    >
      <VStack h="full" maxWidth={404}>
        <Box
          w="full"
          overflowY="auto"
          flex="1"
          css={{
            '&::-webkit-scrollbar': { width: '0' },
            scrollbarWidth: 'none',
          }}
        >
          <CreateVaultDialog open={isOpen} onOpenChange={onOpenChange} />

          <HStack gap={3} paddingX={6} paddingTop={5} w="full">
            <Avatar
              shape="rounded"
              boxSize={'40px'}
              border="2px solid #EBA312"
              src={userInfos?.avatar}
            />

            <VStack w="full" alignItems={'flex-start'}>
              <Text
                // variant="subtitle"
                truncate
                w="full"
                color="grey.75"
                fontSize={12}
                fontWeight={500}
                lineHeight={4}
              >
                {getUserAddress()}
              </Text>

              {isWebAuthn && (
                <Text
                  // variant="subtitle"
                  fontWeight={400}
                  truncate
                  w="full"
                  color="grey.550"
                  fontSize={12}
                  lineHeight={4}
                >
                  {AddressUtils.format(
                    AddressUtils.toBech32(userInfos?.address),
                    15,
                  )}
                </Text>
              )}
            </VStack>

            <Spacer />

            <Button
              colorPalette="primary"
              color="grey.75"
              bgColor="grey.825"
              size="xs"
              minW={140}
              height={8}
              fontWeight={400}
              fontSize="12px"
              onClick={logout}
            >
              <RiLogoutBoxRLine size={14} />
              Change account
            </Button>
          </HStack>

          <Separator borderColor="grey.425" marginTop={5} />

          <Box
            display="flex"
            w={'full'}
            flexDirection={'column'}
            px={6}
            pt={4}
            pb={0}
            //flex={1}
            //bgColor={'green.100'}
          >
            <HStack
              gap={2}
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Heading fontSize={12} fontWeight={700} color="grey.50">
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

            <CustomSkeleton loading={isLoading} mt={4}>
              {/* Result */}
              <VStack
                w="full"
                mt={0}
                gap={2}
                overflowY="scroll"
                css={{
                  '&::-webkit-scrollbar': { width: '0' },
                  scrollbarWidth: 'none',
                }}
              >
                {vaults?.map((vault) => {
                  if (!vault) return null;

                  const {
                    id,
                    name,
                    predicateAddress,
                    workspace,
                    members,
                    root,
                  } = vault;

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
                      id={id}
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
                    <Loader color="brand.500" size="md" />
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
                <VStack mb={6} h={'full'} gap={5}>
                  <Card.Root
                    w="full"
                    bgColor="transparent"
                    display="flex"
                    borderWidth={1}
                    borderColor="grey.300"
                    justifyContent="center"
                    flexDirection="column"
                    alignItems="center"
                    h={224}
                    my={1}
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
                  </Card.Root>
                  <Button bg="grey.75" fontSize={14} onClick={onOpen} w="full">
                    Create new Vault
                  </Button>
                </VStack>
              )}
            </CustomSkeleton>
          </Box>
        </Box>

        <VStack
          w={'full'}
          gap={6}
          p={7}
          boxShadow={'0px 8px 24px 0px #00000080'}
          borderTopLeftRadius={16}
          borderTopRightRadius={16}
          maxH={195}
        >
          <DappTransaction.RequestingFrom name={name} origin={origin} />
          <HStack w="full" justifyContent="center" gap={5}>
            <Button
              colorPalette="secondary"
              borderColor="grey.75"
              paddingX={8}
              onClick={() => {
                handlers.logout?.(true, window.close);
              }}
              w={noVaultsAvailable ? 'full' : 'unset'}
            >
              Cancel
            </Button>

            {!noVaultsAvailable && (
              <Button
                colorPalette="primary"
                width="100%"
                fontWeight={700}
                fontSize={16}
                disabled={
                  !selectedVaultId ||
                  !vaults.length ||
                  isLoading ||
                  send.isPending
                }
                //leftIcon={<RiLink size={22} />}
                onClick={() => {
                  send.mutate({
                    name: name!,
                    origin: origin!,
                    sessionId: sessionId!,
                    request_id: request_id!,
                    vaultId: selectedVaultId,
                    userAddress: userInfos.address,
                  });
                }}
                loading={send.isPending}
              >
                Connect
              </Button>
            )}
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export { VaultConnector };
