import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  CircularProgress,
  Divider,
  HStack,
  Icon,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { TransactionStatus } from 'bakosafe';
import { useEffect } from 'react';
import { RiMenuUnfoldLine } from 'react-icons/ri';

import {
  CustomSkeleton,
  HomeIcon,
  LineCloseIcon,
  TransactionTypeFilters,
} from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages, useGetParams } from '@/modules/core';
import {
  TransactionCard,
  TransactionCardMobile,
  TransactionFilter,
} from '@/modules/transactions/components';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { StatusFilter } from '../../../transactions/hooks';
import { transactionStatus } from '../../../transactions/utils';

const TransactionsVaultPage = () => {
  const {
    vaultPageParams: { workspaceId: vaultWkId },
  } = useGetParams();

  const menuDrawer = useDisclosure();
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: {
        // handleWorkspaceSelection,
        goHome,
      },
    },
    screenSizes: { vaultRequiredSizeToColumnLayout, isMobile, isSmall },
  } = useWorkspaceContext();

  const workspaceId = userInfos.workspace?.id ?? '';

  const {
    vault,
    assets: { hasBalance },
  } = useVaultInfosContext();

  const {
    vaultTransactions: {
      defaultIndex,
      filter,
      inView,
      transactionsRef,
      lists: { transactions },
      handlers: {
        selectedTransaction,
        handleIncomingAction,
        handleOutgoingAction,
        setSelectedTransaction,
        navigate,
      },
      request: { isLoading, isFetching },
    },
    resetAllTransactionsTypeFilters,
  } = useTransactionsContext();

  useEffect(() => {
    return () => {
      resetAllTransactionsTypeFilters();
    };
  }, []);

  const hasTransactions = !isLoading && transactions?.length;

  return (
    <Box w="full" height="100%" maxH="100%">
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />
      <Box mb={10}>
        {vaultRequiredSizeToColumnLayout ? (
          <HStack mt={2} gap={1.5} w="fit-content" onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb>
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
                onClick={() =>
                  navigate(
                    Pages.userVaults({
                      workspaceId,
                    }),
                  )
                }
              >
                Vaults
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.detailsVault({
                      vaultId: vault.data?.id,
                      workspaceId: userInfos.workspace?.id ?? '',
                    }),
                  )
                }
                isTruncated
                maxW={640}
              >
                {vault?.data?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="#"
              >
                Transactions
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </Box>
      {/* TITLE */}
      <HStack
        mb={7}
        justifyContent="space-between"
        alignItems={isSmall ? 'start' : 'center'}
        w="full"
        flexDir={isSmall ? 'column' : 'row'}
      >
        <HStack spacing={5}>
          <Text
            variant="subtitle"
            fontWeight="bold"
            fontSize={{ base: 'sm', sm: 'unset' }}
            color="grey.50"
          >
            Transactions
          </Text>
          <CircularProgress
            hidden={!isFetching}
            size="20px"
            color="brand.500"
            trackColor="dark.100"
            isIndeterminate
          />
        </HStack>

        {!isSmall && (
          <TransactionTypeFilters
            mt={2}
            currentFilter={filter.txFilterType}
            incomingAction={handleIncomingAction}
            outgoingAction={handleOutgoingAction}
          />
        )}
      </HStack>
      {/* FILTER */}
      <TransactionFilter.Control
        value={filter.value!}
        onChange={(value) => {
          setSelectedTransaction({});
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
          value={TransactionStatus.AWAIT_REQUIREMENTS}
          label="Pending"
        />

        {selectedTransaction.id && (
          <HStack spacing={2}>
            <Text color="brand.500">{selectedTransaction.name}</Text>
            <Box
              onClick={() => {
                setSelectedTransaction({});
                filter.set(StatusFilter.ALL);
              }}
              cursor="pointer"
            >
              <Icon as={LineCloseIcon} fontSize="18px" color="brand.500" />
            </Box>
          </HStack>
        )}
      </TransactionFilter.Control>
      {isSmall && (
        <TransactionTypeFilters
          mt={3}
          currentFilter={filter.txFilterType}
          incomingAction={handleIncomingAction}
          outgoingAction={handleOutgoingAction}
          buttonsFullWidth
        />
      )}
      {/* TRANSACTION LIST */}
      <CustomSkeleton isLoaded={!isLoading}>
        {hasTransactions ? (
          <VStack
            maxH="77.5vh"
            overflowY="scroll"
            scrollBehavior="smooth"
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none',
                width: '5px',
                maxHeight: '330px',
                backgroundColor: 'grey.200',
                borderRadius: '30px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'transparent',
                borderRadius: '30px',
                height: '10px',
              },
            }}
            pb={10}
            mt={3}
          >
            {transactions?.map((grouped) => (
              <>
                <HStack w="full">
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="grey.425"
                    whiteSpace="nowrap"
                  >
                    {grouped.monthYear}
                  </Text>

                  <Divider w="full" borderColor="grey.950" />
                </HStack>
                {grouped?.transactions?.map((transaction) => {
                  const status = transactionStatus({
                    ...transaction,
                    account: userInfos?.address,
                  });
                  const isSigner = !!transaction.predicate?.members?.find(
                    (member) => member.address === userInfos?.address,
                  );

                  return (
                    <TransactionCard.List
                      w="full"
                      spacing={0}
                      openIndex={defaultIndex}
                      key={defaultIndex.join(',')}
                    >
                      <Box key={transaction.id} ref={transactionsRef} w="full">
                        <CustomSkeleton isLoaded={!isLoading}>
                          {isMobile ? (
                            <TransactionCardMobile
                              isSigner={isSigner}
                              transaction={transaction}
                              account={userInfos?.address}
                              mt={1.5}
                            />
                          ) : (
                            <TransactionCard.Container
                              mb={0.5}
                              key={transaction.id}
                              status={status}
                              isSigner={isSigner}
                              transaction={transaction}
                              account={userInfos?.address}
                              details={
                                <TransactionCard.Details
                                  transaction={transaction}
                                  status={status}
                                />
                              }
                            />
                          )}
                        </CustomSkeleton>
                      </Box>

                      <Box ref={inView.ref} />
                    </TransactionCard.List>
                  );
                })}
              </>
            ))}
          </VStack>
        ) : (
          <EmptyState
            h="calc(100% - 170px)"
            mt={7}
            isDisabled={hasBalance}
            buttonAction={() =>
              navigate(
                Pages.createTransaction({
                  workspaceId: vaultWkId!,
                  vaultId: vault.data?.id,
                }),
              )
            }
          />
        )}
      </CustomSkeleton>
    </Box>
  );
};

export { TransactionsVaultPage };
