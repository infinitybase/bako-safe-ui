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
import { Pages, PermissionRoles } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { EmptyTransaction } from '@/modules/home/components/EmptyCard/Transaction';
import { EmptyVault } from '@/modules/home/components/EmptyCard/Vault';
import {
  TransactionCard,
  transactionStatus,
  WaitingSignatureBadge,
} from '@/modules/transactions';
import { ExtraVaultCard, VaultCard } from '@/modules/vault';
import { limitCharacters } from '@/utils';

import { useWorkspace } from '../../hooks';

const { ADMIN, MANAGER } = PermissionRoles;

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
  } = useWorkspace();

  const hasVaults = recentVaults.length;
  const hasTransactions = recentTransactions.length > 0;
  // TODO: Replace mocks bellow with dynamic data
  const loadingWorkspaceVaults = false;
  const loadingWorkspaceTransactions = false;
  const balance = '0.00';

  return (
    <VStack w="full" spacing={6}>
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
          {hasPermission([ADMIN]) && (
            <Button
              variant="primary"
              fontWeight="semibold"
              fontSize={15}
              leftIcon={<SettingsIcon fontSize={18} />}
              px={3}
              bg="dark.100"
              color="grey.200"
              // TODO: Add action
              // onClick={() => navigate(Pages.home())}
            >
              Members
            </Button>
          )}

          {hasPermission([ADMIN, MANAGER]) && (
            <Button
              variant="primary"
              fontWeight="bold"
              leftIcon={<FaRegPlusSquare />}
              onClick={() => navigate(Pages.createVault())}
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
              <Box maxW="55%">
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

              <VStack w={150} alignItems="flex-end" spacing={0}>
                <HStack spacing={2}>
                  <HStack spacing={2} justifyContent="flex-end">
                    <Box
                      cursor="pointer"
                      onClick={() => setVisibleBalance((previous) => !previous)}
                    >
                      {visibleBalance ? (
                        <ViewOffIcon boxSize={5} />
                      ) : (
                        <ViewIcon boxSize={5} />
                      )}
                    </Box>
                    <Heading variant="title-xl">
                      {visibleBalance ? balance : '*****'}
                    </Heading>
                    <Heading variant="title-xl" fontWeight="normal">
                      ETH
                    </Heading>
                  </HStack>
                </HStack>

                <Text variant="description">Workspace balance</Text>
              </VStack>
            </HStack>

            <Divider borderColor="dark.100" mt={4} mb={3} />

            <VStack h="full" w="full" alignItems="flex-start" spacing={4}>
              <Text
                fontWeight="semibold"
                color="grey.200"
              >{`Workspace's balance breakdown`}</Text>
              <Card
                w="full"
                h="full"
                p={8}
                borderColor="dark.100"
                borderStyle="dashed"
              >
                <VStack spacing={1}>
                  <Text fontWeight="bold" color="grey.200">
                    First thing first...
                  </Text>
                  <Text color="grey.500">
                    First of all you need to <strong>create a vault!</strong>
                  </Text>
                  <Button
                    variant="primary"
                    fontWeight="semibold"
                    fontSize={15}
                    px={3}
                    mt={2}
                    bg="dark.100"
                    color="grey.200"
                    // TODO: Add action here!
                    // onClick={() => navigate(Pages.home())}
                  >
                    {`Let's do it!`}
                  </Button>
                </VStack>
              </Card>
            </VStack>
          </VStack>
        </Card>

        {/* ACTION CARDS */}
        <VStack w="full" maxH={400} spacing={4}>
          {/* TODO: Fix redirection path */}
          <ActionCard.Container
            w="full"
            onClick={() =>
              navigate(
                Pages.workspaceVaults({ workspaceId: currentWorkspace.id }),
              )
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
          // onClick={() => {
          //   return hasTransactions
          //     ? navigate(Pages.userTransactions())
          //     : null;
          // }}
          >
            <ActionCard.Icon icon={GoArrowSwitch} />
            <Box>
              <ActionCard.Title>Transactions</ActionCard.Title>
              <ActionCard.Description maxWidth={{}}>
                Manage Transactions Across All Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container onClick={() => navigate(Pages.addressBook())}>
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
            title="Anything to show here."
            description="It seems like this workspace has no vaults. Would you like to make one now?"
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
                        onClick={() => navigate(Pages.userVaults())}
                      />
                    ) : (
                      <VaultCard
                        name={name}
                        title={description}
                        address={predicateAddress}
                        members={members!}
                        onClick={() =>
                          navigate(Pages.detailsVault({ vaultId: id }))
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

      <HStack w="full" spacing={4}>
        <Text
          variant="subtitle"
          fontWeight="semibold"
          fontSize="xl"
          color="grey.200"
        >
          Transactions
        </Text>

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
              onClick={() => navigate(Pages.userTransactions())}
            >
              View all
            </Link>
          </HStack>
        )}
      </HStack>

      {/* TRANSACTION LIST */}
      {!hasTransactions ? (
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
                      transaction={transaction}
                      status={transactionStatus({
                        ...transaction,
                        account,
                      })}
                    />
                    <TransactionCard.Actions
                      transaction={transaction}
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
