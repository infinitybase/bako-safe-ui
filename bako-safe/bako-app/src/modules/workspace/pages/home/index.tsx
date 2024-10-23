import { Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {
  AddressBookIcon,
  Card,
  CustomSkeleton,
  EmptyState,
  EyeCloseIcon,
  EyeOpenIcon,
  HomeIcon,
  RefreshIcon,
  SettingsIcon,
  TransactionsIcon,
  VaultIcon,
} from '@ui/components';
import { useRef } from 'react';
import { FaRegPlusSquare } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { Outlet } from 'react-router-dom';

import { Pages, PermissionRoles } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import {
  AssetsDetails,
  CreateVaultDialog,
  ExtraVaultCard,
  VaultCard,
} from '@/modules/vault';
import { WorkspaceSettingsDrawer } from '@/modules/workspace/components';

import WkHomeTransactions from '../../components/wkHomeTransactions';
import { useWorkspaceContext } from '../../WorkspaceProvider';

const { OWNER, ADMIN, MANAGER } = PermissionRoles;

const WorkspacePage = () => {
  const assetsContainerRef = useRef(null);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const workspaceDialog = useDisclosure();

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: {
        navigate,
        handleWorkspaceSelection,
        hasPermission,
        setVisibleBalance,
        goHome,
      },
      infos: { visibleBalance },
      requests: { workspaceBalance, latestPredicates },
      workspaceVaults: { vaultsMax, extraCount },
    },
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const recentVaults = latestPredicates.data?.predicates?.data;

  const hasVaults = recentVaults?.length ?? 0;

  const workspaceId = userInfos.workspace?.id ?? '';

  const balanceUSD = workspaceBalance.balance.currentBalanceUSD;

  const UpdateBalance = (
    <Text
      w={20}
      display="flex"
      align="center"
      justifyContent="space-around"
      variant="description"
      fontWeight="semibold"
      _hover={{
        cursor: 'pointer',
        color: 'grey.200',
      }}
      onClick={() => workspaceBalance.refetch()}
    >
      Update
      <RefreshIcon
        _hover={{
          cursor: 'pointer',
          color: 'grey.200',
        }}
        w={5}
        h={5}
      />
    </Text>
  );

  const WorkspaceBalance = (
    <HStack
      w="full"
      display="flex"
      alignItems="center"
      justifyContent={{ base: 'start', md: 'space-around' }}
      spacing={2}
    >
      <Heading variant="title-xl">
        {visibleBalance ? (
          balanceUSD ? (
            `${balanceUSD} USD`
          ) : (
            <Spinner w={5} h={5} />
          )
        ) : (
          '----'
        )}
      </Heading>
      <Box
        w="auto"
        _hover={{
          cursor: 'pointer',
          opacity: 0.8,
        }}
        onClick={() => setVisibleBalance(!visibleBalance)}
      >
        {visibleBalance ? (
          <EyeOpenIcon boxSize={7} />
        ) : (
          <EyeCloseIcon boxSize={5} />
        )}
      </Box>
    </HStack>
  );

  return (
    <VStack w="full" spacing={6} px={{ base: 0, sm: 8 }}>
      <CreateVaultDialog isOpen={isOpen} onClose={onClose} />
      {/* This outlet components is used to display a blur background */}
      <Outlet />
      <WorkspaceSettingsDrawer
        isOpen={workspaceDialog.isOpen}
        onClose={workspaceDialog.onClose}
      />
      <HStack w="full" h="10" justifyContent="space-between" my={2}>
        <HStack>
          <Button
            display={{ base: 'none', xs: 'flex' }}
            variant="primary"
            fontWeight="semibold"
            fontSize={15}
            leftIcon={
              <Box mr={-1}>
                <IoChevronBack size={22} />
              </Box>
            }
            px={3}
            bg="dark.100"
            color="grey.200"
            onClick={() => goHome()}
          >
            Back home
          </Button>

          <Breadcrumb display={{ base: 'none', sm: 'initial' }} ml={8}>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
              >
                <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            {/* Commented out code to temporarily disable workspaces. */}

            {/* <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  handleWorkspaceSelection(
                    workspaceId,
                    Pages.workspace({
                      workspaceId,
                    }),
                  )
                }
              >
                {limitCharacters(userInfos.workspace?.name ?? '', 10)}
              </BreadcrumbLink>
            </BreadcrumbItem> */}
          </Breadcrumb>
        </HStack>
        <HStack spacing={3}>
          {hasPermission([OWNER, ADMIN]) && (
            <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
              <Button
                variant="primary"
                fontWeight="semibold"
                fontSize={15}
                leftIcon={<SettingsIcon fontSize={18} />}
                px={3}
                bg="grey.200"
                color="dark.300"
                onClick={workspaceDialog.onOpen}
                _hover={{
                  opacity: 0.8,
                }}
              >
                Members
              </Button>
            </CustomSkeleton>
          )}

          {hasPermission([OWNER, ADMIN, MANAGER]) && (
            <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
              <Button
                variant="primary"
                fontWeight="bold"
                leftIcon={<FaRegPlusSquare />}
                _hover={{
                  opacity: 0.8,
                }}
                onClick={onOpen}
              >
                Create vault
              </Button>
            </CustomSkeleton>
          )}
        </HStack>
      </HStack>
      <Stack
        w="full"
        spacing={6}
        direction={{ base: 'column-reverse', md: 'row' }}
      >
        {/* WORKSPACE OVERVIEW */}
        <CustomSkeleton
          isLoaded={!latestPredicates.isLoading}
          style={{ padding: 0, margin: 0 }}
          w="full"
          h="full"
        >
          <Box
            display={{ base: 'block', sm: 'none' }}
            mt={2}
            mb={4}
            alignSelf="flex-start"
          >
            <Text
              color="grey.400"
              variant="subtitle"
              fontWeight="semibold"
              fontSize="md"
            >
              Overview
            </Text>
          </Box>
          <Card
            p={{ base: 4, sm: 8 }}
            h={{ base: 'unset', md: 'full' }}
            bgColor="grey.800"
          >
            <VStack spacing={4} w="full" h="full">
              <HStack
                w="full"
                display="flex"
                alignItems="center"
                justify="space-between"
              >
                <Center
                  w="fit-content"
                  display="flex"
                  gap={6}
                  alignItems="flex-start"
                >
                  <Avatar
                    position="relative"
                    variant="roundedSquare"
                    size={{ base: 'md', sm: 'lg' }}
                    p={{ base: 10, sm: 14 }}
                    bgColor="grey.600"
                    color="grey.450"
                    fontWeight="bold"
                    name={userInfos.workspace?.name}
                  >
                    <Box
                      position="absolute"
                      borderRadius="md"
                      w="calc(100% - 10px)"
                      h="calc(100% - 10px)"
                      borderWidth={{ base: 2, sm: 3 }}
                      borderColor="grey.450"
                    />
                  </Avatar>
                  <Box>
                    <Heading
                      variant="title-xl"
                      w="max"
                      maxW={{
                        base: '60px',
                        xs: '200px',
                      }}
                      textOverflow="ellipsis"
                      isTruncated
                    >
                      {userInfos.workspace?.name}
                    </Heading>

                    <Text
                      maxW={{ base: '60px', xs: '140px' }}
                      variant="description"
                      textOverflow="ellipsis"
                      isTruncated
                    >
                      {userInfos.workspace?.description}
                    </Text>
                  </Box>
                </Center>
                <VStack spacing={4} alignSelf="flex-start">
                  {!isMobile && (
                    <Box width="auto">
                      <HStack
                        minW={20}
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-end"
                      >
                        {WorkspaceBalance}
                        {UpdateBalance}
                      </HStack>
                    </Box>
                  )}

                  {isMobile && UpdateBalance}
                </VStack>
              </HStack>
              {isMobile && (
                <HStack width="full" display="flex" flexDirection="column">
                  {WorkspaceBalance}
                </HStack>
              )}
              <Divider w="full" borderColor="grey.400" />
              <VStack h="full" w="full" alignItems="flex-start" spacing={4}>
                <Text
                  fontWeight="semibold"
                  color="grey.450"
                >{`Workspace's balance breakdown`}</Text>

                <CustomSkeleton
                  isLoaded={!workspaceBalance.isLoading}
                  w="full"
                  h="full"
                >
                  {workspaceBalance.balance.assetsBalance.length === 0 ? (
                    <Card
                      w="full"
                      h="full"
                      p={8}
                      borderColor="dark.100"
                      borderStyle="dashed"
                    >
                      <VStack h="full" spacing={1} justifyContent="center">
                        <Text fontWeight="bold" color="grey.200">
                          First thing first...
                        </Text>
                        <Text color="white" maxW={340} textAlign="center">
                          {`You don't have any vaults yet. Create a vault to start to
                    save your assets.`}
                        </Text>
                      </VStack>
                    </Card>
                  ) : (
                    <HStack
                      ref={assetsContainerRef}
                      w="full"
                      h="full"
                      spacing={{ base: 2, sm: 4 }}
                      justifyContent="flex-start"
                    >
                      <AssetsDetails
                        containerRef={assetsContainerRef}
                        assets={workspaceBalance.balance.assetsBalance}
                        visibleBalance={visibleBalance}
                        viewAllRedirect={Pages.balanceWorkspace({
                          workspaceId,
                        })}
                      />
                    </HStack>
                  )}
                </CustomSkeleton>
              </VStack>
            </VStack>
          </Card>
        </CustomSkeleton>

        {/* ACTION CARDS */}
        <VStack
          w="full"
          maxW={{ base: 'full', md: 500 }}
          maxH={450}
          spacing={5}
        >
          <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
            <ActionCard.Container
              w="full"
              onClick={() => navigate(Pages.userVaults({ workspaceId }))}
            >
              <ActionCard.Icon icon={VaultIcon} />
              <Box w="full">
                <ActionCard.Title>Vaults</ActionCard.Title>
                <ActionCard.Description maxWidth={{}}>
                  Access and Manage All Your Vaults in One Place.
                </ActionCard.Description>
              </Box>
            </ActionCard.Container>
          </CustomSkeleton>

          <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
            <ActionCard.Container
              onClick={() =>
                navigate(
                  Pages.userTransactions({
                    workspaceId,
                  }),
                )
              }
            >
              <ActionCard.Icon icon={TransactionsIcon} />
              <Box>
                <ActionCard.Title>Transactions</ActionCard.Title>
                <ActionCard.Description maxWidth={{}}>
                  Manage Transactions Across All Vaults in One Place.
                </ActionCard.Description>
              </Box>
            </ActionCard.Container>
          </CustomSkeleton>

          <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
            <ActionCard.Container
              onClick={() =>
                navigate(
                  Pages.addressBook({
                    workspaceId,
                  }),
                )
              }
            >
              <ActionCard.Icon icon={AddressBookIcon} />
              <Box>
                <ActionCard.Title>Address book</ActionCard.Title>
                <ActionCard.Description maxWidth={{}}>
                  Access and Manage Your Contacts for Easy Transfers and Vault
                  Creation.
                </ActionCard.Description>
              </Box>
            </ActionCard.Container>
          </CustomSkeleton>
        </VStack>
      </Stack>
      {/* WORKSPACE VAULTS */}
      <Box mt={4} mb={-2} alignSelf="flex-start">
        <Text
          color="grey.400"
          variant="subtitle"
          fontWeight="semibold"
          fontSize="md"
        >
          Recently used vaults
        </Text>
      </Box>
      <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
        {!hasVaults ? (
          <>
            <EmptyState
              showAction={hasPermission([OWNER, MANAGER, ADMIN])}
              title={`Let's Begin!`}
              subTitle="Your vaults are entirely free on Fuel. You need
              create a vault to start to save your assets."
              buttonActionTitle="Create my first vault"
              buttonAction={onOpen}
            />
          </>
        ) : (
          <Grid
            w="full"
            mt={{ base: -8, sm: -2 }}
            maxW="full"
            templateColumns={{
              base: 'repeat(1, 1fr)',
              xs: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            }}
            gap={6}
          >
            {recentVaults?.map(
              ({ id, name, workspace, members, description, owner }, index) => {
                const lastCard = index === vaultsMax - 1;
                const hasMore = extraCount > 0;

                return (
                  <GridItem key={id} maxH={{ base: 180, sm: 190 }}>
                    <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
                      {lastCard && hasMore ? (
                        <ExtraVaultCard
                          mt={{ base: 6, sm: 'unset' }}
                          maxH={{ base: 185, sm: 190 }}
                          extra={extraCount}
                          onClick={() =>
                            handleWorkspaceSelection(
                              workspaceId,
                              Pages.userVaults({
                                workspaceId,
                              }),
                            )
                          }
                        />
                      ) : (
                        <VaultCard
                          ownerId={owner.id}
                          name={name}
                          workspace={workspace}
                          title={description}
                          members={members!}
                          onClick={() =>
                            handleWorkspaceSelection(
                              workspaceId,
                              Pages.detailsVault({
                                workspaceId,
                                vaultId: id,
                              }),
                            )
                          }
                        />
                      )}
                    </CustomSkeleton>
                  </GridItem>
                );
              },
            )}
          </Grid>
        )}
      </CustomSkeleton>

      {recentVaults && recentVaults.length >= 1 && (
        <Box w="full" minH="650px">
          <WkHomeTransactions />
        </Box>
      )}
    </VStack>
  );
};

export { WorkspacePage };
