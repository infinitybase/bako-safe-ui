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
import { RiMenuUnfoldLine } from 'react-icons/ri';

import {
  CustomSkeleton,
  HomeIcon,
  LineCloseIcon,
  TransactionTypeFilters,
} from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Drawer } from '@/layouts/dashboard/drawer';
import { useAuth } from '@/modules/auth';
import { Pages, useGetParams, useScreenSize } from '@/modules/core';
import { useHome } from '@/modules/home';
import {
  TransactionCard,
  TransactionCardMobile,
  TransactionFilter,
} from '@/modules/transactions/components';
import { useGetCurrentWorkspace, useWorkspace } from '@/modules/workspace';

import { StatusFilter, useTransactionList } from '../../../transactions/hooks';
import { transactionStatus } from '../../../transactions/utils';
import { useFilterTxType } from '../../../transactions/hooks/filter';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useNavigate } from 'react-router-dom';

const TransactionsVaultPage = () => {
  const { txFilterType, handleIncomingAction, handleOutgoingAction } =
    useFilterTxType();

  const navigate = useNavigate();
  const {
    vaultPageParams: { workspaceId: vaultWkId },
  } = useGetParams();

  const {
    transactionRequest,
    infinityTransactionsRef,
    infinityTransactions,
    filter,
    inView,
    account,
    selectedTransaction,
    setSelectedTransaction,
    defaultIndex,
  } = useTransactionList({ byMonth: true, type: txFilterType });
  const { goHome } = useHome();
  const { vaultRequiredSizeToColumnLayout, isMobile, isSmall } =
    useScreenSize();

  const menuDrawer = useDisclosure();
  const {
    workspaces: { current },
    isSingleWorkspace,
  } = useAuth();
  const workspaceId = current ?? '';

  const { goWorkspace } = useWorkspace();
  const { workspace } = useGetCurrentWorkspace();
  const {
    vault,
    transactions: vaultTransaction,
    assets: { hasBalance },
  } = useVaultInfosContext();

  const { transactions, isLoading } = vaultTransaction;
  const hasTransactions = !isLoading && transactions?.data?.length;

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

            {!isSingleWorkspace && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goWorkspace(current)}
                  maxW={40}
                  isTruncated
                >
                  {workspace?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

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
                      vaultId: vault.predicate?.id!,
                      workspaceId: current ?? '',
                    }),
                  )
                }
                isTruncated
                maxW={640}
              >
                {vault?.predicate?.name}
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
            fontWeight={700}
            fontSize="md"
            color="grey.50"
          >
            Transactions
          </Text>
          <CircularProgress
            hidden={!transactionRequest.isFetching}
            size="20px"
            color="brand.500"
            trackColor="dark.100"
            isIndeterminate
          />
        </HStack>

        {!isSmall && (
          <TransactionTypeFilters
            mt={2}
            currentFilter={txFilterType}
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
          currentFilter={txFilterType}
          incomingAction={handleIncomingAction}
          outgoingAction={handleOutgoingAction}
          buttonsFullWidth
        />
      )}
      {/* TRANSACTION LIST */}
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
          {infinityTransactions?.map((grouped) => (
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
              {grouped?.transactions.map((transaction) => {
                const status = transactionStatus({
                  ...transaction,
                  account,
                });
                const isSigner = !!transaction.predicate?.members?.find(
                  (member) => member.address === account,
                );

                return (
                  <TransactionCard.List
                    w="full"
                    spacing={0}
                    openIndex={defaultIndex}
                    key={defaultIndex.join(',')}
                  >
                    <Box
                      key={transaction.id}
                      ref={infinityTransactionsRef}
                      w="full"
                    >
                      <CustomSkeleton isLoaded={!transactionRequest.isLoading}>
                        {isMobile ? (
                          <TransactionCardMobile
                            isSigner={isSigner}
                            transaction={transaction}
                            account={account}
                            mt={1.5}
                          />
                        ) : (
                          <TransactionCard.Container
                            mb={0.5}
                            key={transaction.id}
                            status={status}
                            isSigner={isSigner}
                            transaction={transaction}
                            account={account}
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
                vaultId: vault.predicate?.id!,
              }),
            )
          }
        />
      )}
    </Box>
  );
};

export { TransactionsVaultPage };
