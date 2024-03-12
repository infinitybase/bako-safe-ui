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
  Link,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ITransaction, IWitnesses } from 'bsafe';
import { format } from 'date-fns';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';
import { IoChevronBack } from 'react-icons/io5';

import {
  Card,
  CustomSkeleton,
  HomeIcon,
  SettingsIcon,
  VaultIcon,
} from '@/components';
import { AddressBookIcon } from '@/components/icons/address-book';
import { EyeCloseIcon } from '@/components/icons/eye-close';
import { EyeOpenIcon } from '@/components/icons/eye-open';
import { RefreshIcon } from '@/components/icons/refresh-icon';
import { useAuth } from '@/modules/auth';
import {
  AssetCard,
  assetsMap,
  NativeAssetId,
  Pages,
  PermissionRoles,
  useScreenSize,
} from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { EmptyTransaction } from '@/modules/home/components/EmptyCard/Transaction';
import { EmptyVault } from '@/modules/home/components/EmptyCard/Vault';
import { useHome } from '@/modules/home/hooks/useHome';
import {
  TransactionCard,
  TransactionCardMobile,
  transactionStatus,
  WaitingSignatureBadge,
} from '@/modules/transactions';
import { ExtraVaultCard, VaultCard } from '@/modules/vault';
import { WorkspaceSettingsDrawer } from '@/modules/workspace/components';
import { limitCharacters } from '@/utils';

import { useWorkspace } from '../../hooks';

const { OWNER, ADMIN, MANAGER } = PermissionRoles;

const WorkspacePage = () => {
  const {
    account,
    navigate,
    currentWorkspace: { workspace: currentWorkspace },
    workspaceVaults: { vaultsMax, extraCount, recentVaults },
    workspaceTransactions: { recentTransactions },
    hasPermission,
    visibleBalance,
    setVisibleBalance,
    workspaceDialog,
    worksapceBalance,
    pendingSignerTransactions,
    workspaceHomeRequest,
    goWorkspace,
  } = useWorkspace();
  const { goHome } = useHome();
  const { isMobile } = useScreenSize();

  const {
    workspaces: { current },
  } = useAuth();

  const hasVaults = recentVaults?.length ?? 0;
  const hasTransactions = recentTransactions && recentTransactions?.length > 0;
  const workspaceId = current ?? '';

  const isSigner = (witnesses: IWitnesses[]) => {
    return !!witnesses.find((w: IWitnesses) => w.account === account);
  };

  if (!currentWorkspace || currentWorkspace.single) {
    return null;
  }

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
      onClick={() => worksapceBalance.refetch()}
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
      justifyContent={['start', 'space-around']}
      spacing={2}
    >
      <Heading variant="title-xl">
        {visibleBalance
          ? `${worksapceBalance.balance.balanceUSD} USD`
          : '-----'}
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
    <VStack w="full" spacing={6} px={[0, 12]}>
      <WorkspaceSettingsDrawer
        isOpen={workspaceDialog.isOpen}
        onClose={workspaceDialog.onClose}
      />
      <HStack w="full" h="10" justifyContent="space-between" my={2}>
        <HStack>
          <Button
            display={['none', 'flex']}
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

          <Breadcrumb display={['none', 'initial']} ml={8}>
            <BreadcrumbItem>
              <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goWorkspace(workspaceId)}
              >
                {currentWorkspace?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </HStack>
        <HStack spacing={3}>
          {hasPermission([OWNER, ADMIN]) && (
            <CustomSkeleton isLoaded={!workspaceHomeRequest.isLoading}>
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
            <CustomSkeleton isLoaded={!workspaceHomeRequest.isLoading}>
              <Button
                variant="primary"
                fontWeight="bold"
                leftIcon={<FaRegPlusSquare />}
                _hover={{
                  opacity: 0.8,
                }}
                onClick={() => navigate(Pages.createVault({ workspaceId }))}
              >
                Create vault
              </Button>
            </CustomSkeleton>
          )}
        </HStack>
      </HStack>

      <Stack w="full" spacing={6} direction={['column-reverse', 'row']}>
        {/* WORKSPACE OVERVIEW */}
        <CustomSkeleton
          isLoaded={!workspaceHomeRequest.isLoading}
          style={{ padding: 0, margin: 0 }}
          w="full"
          h="full"
        >
          <Box display={['block', 'none']} mt={2} mb={4} alignSelf="flex-start">
            <Text
              color="grey.400"
              variant="subtitle"
              fontWeight="semibold"
              fontSize="md"
            >
              Overview
            </Text>
          </Box>
          <Card p={[4, 8]} bgColor="grey.800">
            <VStack spacing={6} w="full">
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
                    size={['md', 'lg']}
                    p={[10, 14]}
                    bgColor="grey.600"
                    color="grey.450"
                    fontWeight="bold"
                    name={currentWorkspace.name}
                  >
                    <Box
                      position="absolute"
                      borderRadius="md"
                      w="calc(100% - 10px)"
                      h="calc(100% - 10px)"
                      borderWidth={[2, 3]}
                      borderColor="grey.450"
                    />
                  </Avatar>
                  <Box>
                    <Heading variant="title-xl" w="max">
                      {currentWorkspace?.name}
                    </Heading>

                    <Text
                      maxW={['100px', '200px']}
                      variant="description"
                      textOverflow="ellipsis"
                      isTruncated
                    >
                      {currentWorkspace.description}
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
                        alignItems="center"
                      >
                        {WorkspaceBalance}
                        {UpdateBalance}
                      </HStack>
                    </Box>
                  )}

                  {isMobile && UpdateBalance}

                  {/* <VStack spacing={2} alignItems="flex-start">
                  <Button
                    onClick={() =>
                      navigate(
                        Pages.createTransaction({
                          vaultId: vault.id!,
                          workspaceId,
                        }),
                      )
                    }
                    isDisabled={
                      !vault?.hasBalance ||
                      !makeTransactionsPerm ||
                      vaultDetails.transactions.isPendingSigner
                    }
                    minW={130}
                    variant="primary"
                  >
                    Send
                  </Button>
                  {vault.transactions.isPendingSigner ? (
                    <Text variant="description" fontSize="xs" color="error.500">
                      This vault has pending transactions.
                    </Text>
                  ) : !makeTransactionsPerm ? (
                    <Text variant="description" fontSize="xs" color="error.500">
                      You dont have permission to send transactions.
                    </Text>
                  ) : (
                    <Text variant="description" fontSize="xs">
                      Send single or batch <br /> payments with multi assets.
                    </Text>
                  )}
                </VStack> */}
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
                  isLoaded={!worksapceBalance.isLoading}
                  w="full"
                  h="full"
                >
                  {parseFloat(worksapceBalance.balance.balanceUSD!) === 0 ||
                  !worksapceBalance.balance.balance ? (
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
                    <VStack
                      w="full"
                      h="full"
                      spacing={1}
                      justifyContent="center"
                    >
                      {/*todo:
                      - update service with typing returning the assets -> Asset[]
                      - implement a recursive function to render the diferent assets, and make to dynamic data
                  */}
                      <AssetCard
                        asset={{
                          ...assetsMap[NativeAssetId],
                          assetId: NativeAssetId,
                          amount: worksapceBalance.balance.balance,
                        }}
                        visibleBalance={visibleBalance}
                      />
                    </VStack>
                  )}
                </CustomSkeleton>
              </VStack>
            </VStack>
          </Card>
        </CustomSkeleton>

        {/* ACTION CARDS */}
        <VStack w="full" maxW={['full', 500]} maxH={450} spacing={4}>
          <CustomSkeleton isLoaded={!workspaceHomeRequest.isLoading}>
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

          <CustomSkeleton isLoaded={!workspaceHomeRequest.isLoading}>
            <ActionCard.Container
              onClick={() =>
                navigate(
                  Pages.userTransactions({
                    workspaceId,
                  }),
                )
              }
            >
              <ActionCard.Icon icon={GoArrowSwitch} />
              <Box>
                <ActionCard.Title>Transactions</ActionCard.Title>
                <ActionCard.Description maxWidth={{}}>
                  Manage Transactions Across All Vaults in One Place.
                </ActionCard.Description>
              </Box>
            </ActionCard.Container>
          </CustomSkeleton>

          <CustomSkeleton isLoaded={!workspaceHomeRequest.isLoading}>
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

      <CustomSkeleton isLoaded={!workspaceHomeRequest.isLoading}>
        {!hasVaults ? (
          <EmptyVault
            showActionButton={hasPermission([OWNER, MANAGER, ADMIN])}
            description="Your vaults are entirely free on Fuel. You need
            create a vault to start to save your assets."
          />
        ) : (
          <Grid w="full" templateColumns={['block', 'repeat(4, 1fr)']} gap={6}>
            {recentVaults?.map(
              ({ id, name, workspace, members, description }, index) => {
                const lastCard = index === vaultsMax - 1;
                const hasMore = extraCount > 0;

                return (
                  <GridItem key={id}>
                    <CustomSkeleton isLoaded={!workspaceHomeRequest.isLoading}>
                      {lastCard && hasMore ? (
                        <ExtraVaultCard
                          extra={extraCount}
                          onClick={() =>
                            navigate(
                              Pages.userVaults({
                                workspaceId,
                              }),
                            )
                          }
                        />
                      ) : (
                        <VaultCard
                          id={id}
                          name={name}
                          workspace={workspace}
                          title={description}
                          members={members!}
                          onClick={() =>
                            navigate(
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

      {hasVaults && (
        <HStack w="full" mt={4} spacing={4}>
          <Text
            color="grey.400"
            variant="subtitle"
            fontWeight="semibold"
            fontSize="md"
          >
            Transactions
          </Text>

          {hasTransactions && (
            <HStack>
              <WaitingSignatureBadge
                isLoading={pendingSignerTransactions.isLoading}
                quantity={pendingSignerTransactions.data?.ofUser ?? 0}
              />
              <Spacer />
              <Link
                display={['none', 'block']}
                color="brand.500"
                onClick={() =>
                  navigate(
                    Pages.userTransactions({
                      workspaceId,
                    }),
                  )
                }
              >
                View all
              </Link>
            </HStack>
          )}
        </HStack>
      )}

      {/* TRANSACTION LIST */}
      {!hasTransactions && hasVaults ? (
        <CustomSkeleton isLoaded={!workspaceHomeRequest.isLoading}>
          <EmptyTransaction />
        </CustomSkeleton>
      ) : (
        <Box w="full" pb={10}>
          <TransactionCard.List spacing={[3, 4]} mb={[0, 12]}>
            {recentTransactions?.map((transaction) => {
              const status = transactionStatus({ ...transaction, account });

              return (
                <CustomSkeleton
                  isLoaded={!workspaceHomeRequest.isLoading}
                  key={transaction.id}
                >
                  {isMobile ? (
                    <TransactionCardMobile
                      isSigner={isSigner(transaction.witnesses)}
                      transaction={transaction}
                      account={account}
                    />
                  ) : (
                    <TransactionCard.Container
                      status={status}
                      transaction={transaction}
                      account={account}
                      isSigner={isSigner(transaction.witnesses)}
                      details={
                        <TransactionCard.Details
                          transaction={transaction}
                          status={status}
                        />
                      }
                    >
                      {transaction.predicate && (
                        <TransactionCard.VaultInfo
                          vault={transaction.predicate}
                        />
                      )}
                      <TransactionCard.CreationDate>
                        {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
                      </TransactionCard.CreationDate>
                      <TransactionCard.Assets />
                      <TransactionCard.Amount
                        assets={transaction.resume.outputs}
                      />
                      <TransactionCard.Name>
                        {limitCharacters(transaction.name, 20)}
                      </TransactionCard.Name>
                      <TransactionCard.Status
                        transaction={transaction as unknown as ITransaction}
                        status={transactionStatus({
                          ...transaction,
                          account,
                        })}
                      />
                      <TransactionCard.Actions
                        transaction={transaction as unknown as ITransaction}
                        status={transactionStatus({
                          ...transaction,
                          account,
                        })}
                        isSigner={isSigner(transaction.witnesses)}
                      />
                    </TransactionCard.Container>
                  )}
                </CustomSkeleton>
              );
            })}
          </TransactionCard.List>
        </Box>
      )}
    </VStack>
  );
};

export { WorkspacePage };
