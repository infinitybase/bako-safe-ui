import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  HStack,
  Icon,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { FaRegPlusSquare } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { Pages, PermissionRoles, WorkspacesQueryKey } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { CreateVaultDialog } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import {
  TransactionCard,
  TransactionFilter,
  WaitingSignatureBadge,
} from '../../components';
import { StatusFilter } from '../../hooks';
import { useTransactionSocketListener } from '../../hooks/events/useTransactionsSocketListener';
import { useTransactionsContext } from '../../providers/TransactionsProvider';

const UserTransactionsPage = () => {
  const {
    transactionsPageList: {
      transactionsRef,
      request: { isLoading, isFetching, hasNextPage },
      filter,
      handlers: { navigate },
      lists: { transactions },
    },
    pendingSignerTransactions,
    resetAllTransactionsTypeFilters,
  } = useTransactionsContext();

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { hasPermission, handleWorkspaceSelection, goHome },
    },
    screenSizes: { isMobile, isExtraSmall, isSmall },
  } = useWorkspaceContext();

  const { OWNER, MANAGER, ADMIN } = PermissionRoles;
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const emptyTransactions = !isLoading && !transactions.length && !isFetching;

  useEffect(() => {
    return () => resetAllTransactionsTypeFilters();
  }, []);

  const transactionQueryKey =
    WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      userInfos.workspace?.id ?? undefined,
      filter.value as StatusFilter,
    );

  useTransactionSocketListener(transactionQueryKey ?? []);

  return (
    <VStack
      w="full"
      gap={6}
      p={{ base: 1, sm: 1 }}
      px={{ base: 'auto', sm: 8 }}
    >
      <CreateVaultDialog open={isOpen} onOpenChange={onOpenChange} />

      <HStack w="full" h="10" justifyContent="space-between">
        <HStack>
          <Button
            colorPalette="primary"
            fontWeight="semibold"
            fontSize={15}
            px={3}
            bg="dark.100"
            color="grey.200"
            onClick={() =>
              userInfos.onSingleWorkspace
                ? goHome()
                : handleWorkspaceSelection(
                    userInfos.workspace?.id,
                    Pages.workspace({ workspaceId: userInfos.workspace?.id }),
                  )
            }
          >
            <IoChevronBack size={22} />
            Back home
          </Button>

          {!isMobile && (
            <>
              <Breadcrumb.Root ml={8}>
                <Breadcrumb.List>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      fontSize="sm"
                      color="grey.200"
                      fontWeight="semibold"
                      onClick={() => goHome()}
                    >
                      <Icon mr={2} as={HomeIcon} w={3} color="grey.200" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <Breadcrumb.Separator />

                  {/* Commented out code to temporarily disable workspaces. */}

                  {/* {!userInfos.onSingleWorkspace && (
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      fontSize="sm"
                      color="grey.200"
                      fontWeight="semibold"
                      onClick={() =>
                        handleWorkspaceSelection(
                          userInfos.workspace?.id,
                          Pages.workspace({
                            workspaceId: userInfos.workspace?.id,
                          }),
                        )
                      }
                      maxW={40}
                      isTruncated
                    >
                      {userInfos.workspace?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )} */}
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      fontSize="sm"
                      color="grey.200"
                      fontWeight="semibold"
                      href="#"
                    >
                      My Transactions
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb.List>
              </Breadcrumb.Root>
            </>
          )}
        </HStack>
        <Box>
          <Button
            disabled={!hasPermission([OWNER, MANAGER, ADMIN])}
            colorPalette="primary"
            fontWeight="bold"
            onClick={onOpen}
          >
            <FaRegPlusSquare />
            Create vault
          </Button>
        </Box>
      </HStack>

      {/* ACTION BUTTONS */}
      <Stack w="full" direction={{ base: 'column', md: 'row' }} gap={6}>
        <ActionCard.Container
          onClick={() =>
            navigate(
              Pages.userVaults({
                workspaceId: userInfos.workspace?.id ?? '',
              }),
            )
          }
        >
          <ActionCard.Icon>
            <VaultIcon w={6} />
          </ActionCard.Icon>
          <Box>
            <ActionCard.Title>Vaults</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage All Your Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container cursor="auto">
          <ActionCard.Icon>
            <TransactionsIcon w={6} />
          </ActionCard.Icon>
          <Box>
            <ActionCard.Title>Transactions</ActionCard.Title>
            <ActionCard.Description>
              Manage Transactions Across All Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container
          onClick={() =>
            navigate(
              Pages.addressBook({
                workspaceId: userInfos.workspace?.id ?? '',
              }),
            )
          }
        >
          <ActionCard.Icon>
            <AddressBookIcon w={6} />
          </ActionCard.Icon>
          <Box>
            <ActionCard.Title>Address book</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage Your Contacts for Easy Transfers and Vault
              Creation.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>
      </Stack>

      {/* USER TRANSACTIONS */}
      <VStack w="full" mt={6}>
        <HStack
          justifyContent="space-between"
          alignItems={isSmall ? 'start' : 'center'}
          w="full"
          flexDir={isSmall ? 'column' : 'row'}
        >
          <Box
            w="full"
            display="flex"
            alignItems={'center'}
            flexDir={isExtraSmall ? 'column' : 'row'}
            gap={isExtraSmall ? 2 : 4}
          >
            <Text fontWeight="semibold" color="grey.75">
              Transactions
            </Text>
            <WaitingSignatureBadge
              isLoading={pendingSignerTransactions.isLoading}
              quantity={pendingSignerTransactions.data?.ofUser ?? 0}
            />
          </Box>
        </HStack>

        {/* FILTER */}
        {
          <VStack w="full" alignItems="start">
            <Box>
              <TransactionFilter.Control
                value={filter.value!}
                onChange={(value) => {
                  filter.set(value as StatusFilter);
                }}
              >
                <TransactionFilter.Field value={StatusFilter.ALL} label="All" />
                <TransactionFilter.Field
                  value={StatusFilter.COMPLETED}
                  label="Completed"
                />
                <TransactionFilter.Field
                  value={StatusFilter.DECLINED}
                  label="Declined"
                />
                <TransactionFilter.Field
                  value={StatusFilter.PENDING}
                  label="Pending"
                />
              </TransactionFilter.Control>
            </Box>
          </VStack>
        }
      </VStack>

      <CustomSkeleton h="full" loading={isLoading}>
        {emptyTransactions && (
          <EmptyState
            h="full"
            showAction={false}
            title="No Data available"
            subTitle="It seems like you haven't made any transactions yet."
          />
        )}
        {/* LIST */}
        {!emptyTransactions && (
          <VStack h="35vh" mt={-3} w="full">
            {transactions?.map((grouped) => (
              <Box key={grouped.monthYear} w="full">
                <TransactionCard.GroupMonth monthYear={grouped.monthYear} />

                <TransactionCard.List mt={1} w="full" gap={0}>
                  {grouped?.transactions.map((transaction) => (
                    <TransactionCard.Item
                      key={transaction.id}
                      ref={transactionsRef}
                      w="full"
                      isMobile={isMobile}
                      transaction={transaction}
                      userInfos={userInfos}
                    />
                  ))}
                </TransactionCard.List>
              </Box>
            ))}
            {hasNextPage && (
              <Box w="full" display={'flex'} justifyContent={'center'} pb={5}>
                <Spinner alignSelf="center" mt={2} color="brand.500" />
              </Box>
            )}
          </VStack>
        )}
      </CustomSkeleton>
    </VStack>
  );
};

export { UserTransactionsPage };
