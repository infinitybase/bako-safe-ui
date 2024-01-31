import { Icon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Link,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ITransaction } from 'bsafe';
import { format } from 'date-fns';
import { CgList } from 'react-icons/cg';
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
import {
  AssetCard,
  assetsMap,
  NativeAssetId,
  Pages,
  PermissionRoles,
} from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { EmptyTransaction } from '@/modules/home/components/EmptyCard/Transaction';
import { EmptyVault } from '@/modules/home/components/EmptyCard/Vault';
import {
  TransactionCard,
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
    currentWorkspace,
    workspaceVaults: { vaultsMax, extraCount, recentVaults },
    workspaceTransactions: { recentTransactions },
    hasPermission,
    visibleBalance,
    setVisibleBalance,
    workspaceDialog,
    workspaceHomeRequest,
    worksapceBalance,
  } = useWorkspace();

  const hasVaults = recentVaults?.length ?? 0;
  const hasTransactions = recentTransactions && recentTransactions?.length > 0;
  const loadingWorkspaceVaults = workspaceHomeRequest.isLoading;
  const loadingWorkspaceTransactions = workspaceHomeRequest.isLoading;

  return (
    <VStack w="full" spacing={6}>
      <WorkspaceSettingsDrawer
        isOpen={workspaceDialog.isOpen}
        onClose={workspaceDialog.onClose}
        workspace={currentWorkspace}
      />
      <HStack w="full" h="10" justifyContent="space-between" my={2}>
        <HStack>
          <Button
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
            onClick={() => navigate(Pages.home())}
          >
            Back home
          </Button>

          <Breadcrumb ml={8}>
            <BreadcrumbItem>
              <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => navigate(Pages.home())}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.workspace({ workspaceId: currentWorkspace.id }),
                  )
                }
              >
                {currentWorkspace.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </HStack>

        <HStack spacing={3}>
          {hasPermission([OWNER, ADMIN]) && (
            <Button
              variant="primary"
              fontWeight="semibold"
              fontSize={15}
              leftIcon={<SettingsIcon fontSize={18} />}
              px={3}
              bg="dark.100"
              color="grey.200"
              onClick={workspaceDialog.onOpen}
            >
              Members
            </Button>
          )}

          {hasPermission([OWNER, ADMIN, MANAGER]) && (
            <Button
              variant="primary"
              fontWeight="bold"
              leftIcon={<FaRegPlusSquare />}
              onClick={() =>
                navigate(
                  Pages.createVault({ workspaceId: currentWorkspace.id }),
                )
              }
            >
              Create vault
            </Button>
          )}
        </HStack>
      </HStack>

      <HStack w="full" spacing={6}>
        {/* WORKSPACE OVERVIEW */}
        <Card
          w="full"
          maxW="50%"
          h="full"
          p={8}
          bg="dark.200"
          borderColor="dark.100"
        >
          <VStack h="full" alignItems="flex-start">
            <HStack w="full" spacing={6}>
              <Avatar
                variant="roundedSquare"
                name={currentWorkspace.name}
                bg="grey.900"
                color="white"
                size={'lg'}
                p={10}
              />
              <Box maxW="40%">
                <Heading mb={1} variant="title-xl" isTruncated>
                  {currentWorkspace.name}
                </Heading>
                <Box>
                  <Text variant="description" noOfLines={2}>
                    {currentWorkspace?.description}
                  </Text>
                </Box>
              </Box>

              <Spacer />

              <Box
                cursor="pointer"
                onClick={() => setVisibleBalance((previous) => !previous)}
                flexDirection="row"
              >
                <HStack spacing={2}>
                  <Heading variant="title-xl">
                    {(visibleBalance && worksapceBalance.balance?.balanceUSD) ??
                      0}
                  </Heading>
                  <Text variant="description" fontSize="md">
                    {visibleBalance && 'USD'}
                  </Text>
                  {visibleBalance ? (
                    <Box
                      flexDirection="row"
                      alignItems={'center'}
                      justifyContent={'center'}
                    >
                      <ViewIcon boxSize={5} />
                    </Box>
                  ) : (
                    <ViewOffIcon boxSize={5} />
                  )}
                </HStack>
              </Box>
            </HStack>

            <Divider borderColor="dark.100" mt={4} mb={3} />

            <VStack h="full" w="full" alignItems="flex-start" spacing={4}>
              <Text
                fontWeight="semibold"
                color="grey.200"
              >{`Workspace's balance breakdown`}</Text>
              {parseFloat(worksapceBalance.balance.balanceUSD!) === 0 ? (
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
                    <Text color="grey.500" maxW={340} textAlign="center">
                      {`You don't have any vaults yet. Create a vault to start to
                    save your assets.`}
                    </Text>
                  </VStack>
                </Card>
              ) : (
                <VStack h="full" spacing={1} justifyContent="center">
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
                    borderColor="dark.100"
                  />
                </VStack>
              )}
            </VStack>
          </VStack>
        </Card>

        {/* ACTION CARDS */}
        <VStack w="full" maxH={400} spacing={4}>
          <ActionCard.Container
            w="full"
            onClick={() =>
              navigate(Pages.userVaults({ workspaceId: currentWorkspace.id }))
            }
          >
            <ActionCard.Icon icon={VaultIcon} />
            <Box w="full">
              <ActionCard.Title>Vaults</ActionCard.Title>
              <ActionCard.Description maxWidth={{}}>
                Access and Manage All Your Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container
            onClick={() =>
              navigate(
                Pages.userTransactions({ workspaceId: currentWorkspace.id }),
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

          <ActionCard.Container
            onClick={() =>
              navigate(
                Pages.addressBook({
                  workspaceId: currentWorkspace.id,
                }),
              )
            }
          >
            <ActionCard.Icon icon={CgList} />
            <Box>
              <ActionCard.Title>Address book</ActionCard.Title>
              <ActionCard.Description maxWidth={{}}>
                Access and Manage Your Contacts for Easy Transfers and Vault
                Creation.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </VStack>
      </HStack>

      {/* WORKSPACE VAULTS */}
      <Box mt={4} mb={-2} alignSelf="flex-start">
        <Text
          variant="subtitle"
          fontWeight="semibold"
          fontSize="xl"
          color="grey.200"
        >
          {`Workspace's vaults`}
        </Text>
      </Box>

      {!hasVaults ? (
        <CustomSkeleton isLoaded={!loadingWorkspaceVaults}>
          <EmptyVault
            showActionButton={hasPermission([OWNER, MANAGER, ADMIN])}
            description="Your vaults are entirely free on Fuel. You need
            create a vault to start to save your assets."
          />
        </CustomSkeleton>
      ) : (
        <Grid w="full" templateColumns="repeat(4, 1fr)" gap={6}>
          {recentVaults?.map(
            ({ id, name, predicateAddress, members, description }, index) => {
              const lastCard = index === vaultsMax - 1;
              const hasMore = extraCount > 0;

              return (
                <GridItem key={id}>
                  <CustomSkeleton isLoaded={!loadingWorkspaceVaults}>
                    {lastCard && hasMore ? (
                      <ExtraVaultCard
                        extra={extraCount}
                        onClick={() =>
                          navigate(
                            Pages.userVaults({
                              workspaceId: currentWorkspace.id,
                            }),
                          )
                        }
                      />
                    ) : (
                      <VaultCard
                        name={name}
                        title={description}
                        address={predicateAddress}
                        members={members!}
                        onClick={() =>
                          navigate(
                            Pages.detailsVault({
                              workspaceId: currentWorkspace.id,
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

      {hasVaults && (
        <HStack w="full" spacing={4}>
          {
            <Text
              variant="subtitle"
              fontWeight="semibold"
              fontSize="xl"
              color="grey.200"
            >
              Transactions
            </Text>
          }

          {hasTransactions && (
            <HStack>
              <WaitingSignatureBadge
                account={account}
                isLoading={loadingWorkspaceTransactions}
                transactions={recentTransactions}
              />
              <Spacer />
              <Link
                color="brand.500"
                onClick={() =>
                  navigate(
                    Pages.userTransactions({
                      workspaceId: currentWorkspace.id,
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
        <CustomSkeleton isLoaded={!loadingWorkspaceTransactions} pb={10}>
          <EmptyTransaction />
        </CustomSkeleton>
      ) : (
        <Box w="full" mt={4} pb={10}>
          <TransactionCard.List spacing={4} mt={6} mb={12}>
            {recentTransactions?.map((transaction) => {
              const status = transactionStatus({ ...transaction, account });

              return (
                <CustomSkeleton
                  isLoaded={!loadingWorkspaceTransactions}
                  key={transaction.id}
                >
                  <TransactionCard.Container
                    status={status}
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
                    />
                  </TransactionCard.Container>
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
