import { Box, Breadcrumb, HStack, Icon, Loader, Text, VStack } from 'bako-ui';
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
import { Pages } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import {
  TransactionCard,
  TransactionFilter,
} from '@/modules/transactions/components';
import { useTransactionSocketListener } from '@/modules/transactions/hooks/events/useTransactionsSocketListener';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useVaultInfosContext } from '@/modules/vault/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { StatusFilter } from '../../../transactions/hooks';
import { vaultInfinityQueryKey } from '../../hooks/list/useVaultTransactionsRequest';

const TransactionsVaultPage = () => {
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

  const { vault } = useVaultInfosContext();

  const {
    vaultTransactions: {
      defaultIndex,
      filter,
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

  const vaultQueryKey =
    vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      vault.data?.id ?? undefined,
    );

  useTransactionSocketListener(vaultQueryKey ?? []);

  const hasTransactions = !isLoading && transactions?.length;

  return (
    <Box w="full" h="100%" maxH="100%">
      <Drawer open={menuDrawer.isOpen} onOpenChange={menuDrawer.onOpenChange} />
      <Box mb={10}>
        {vaultRequiredSizeToColumnLayout ? (
          <HStack mt={2} gap={1.5} w="fit-content" onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goHome()}
                >
                  <Icon mr={2} as={HomeIcon} w={3} color="grey.200" />
                  Home
                </Breadcrumb.Link>
              </Breadcrumb.Item>
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

              <Breadcrumb.Item>
                <Breadcrumb.Link
                  data-testid="vaultbreadCrumb"
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
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />

              <Breadcrumb.Item>
                <Breadcrumb.Link
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
                  truncate
                  maxW={640}
                >
                  {vault?.data?.name}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />

              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  href="#"
                >
                  Transactions
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
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
        <HStack gap={5}>
          <Text
            // variant="subtitle"
            fontWeight="bold"
            fontSize={{ base: 'sm', sm: 'unset' }}
            color="grey.50"
          >
            Transactions
          </Text>
          <Loader
            hidden={!isFetching}
            size="md"
            color="brand.500"
            css={{ '--spinner-track-color': 'dark.100' }}
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
      {
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
            <HStack gap={2}>
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
      }
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
      <CustomSkeleton h="100%" loading={isLoading}>
        {hasTransactions ? (
          <VStack
            maxH="77.5vh"
            overflowY="scroll"
            scrollBehavior="smooth"
            css={{
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
              <Box key={grouped.monthYear} w="full">
                <TransactionCard.GroupMonth
                  monthYear={grouped.monthYear}
                  mb={2}
                />
                <TransactionCard.List w="full" gap={0} openIndex={defaultIndex}>
                  {grouped?.transactions?.map((transaction) => {
                    return (
                      <TransactionCard.Item
                        w="full"
                        key={transaction.id}
                        isMobile={isMobile}
                        transaction={transaction}
                        userInfos={userInfos}
                        ref={transactionsRef}
                      />
                    );
                  })}
                </TransactionCard.List>
              </Box>
            ))}
          </VStack>
        ) : (
          <EmptyState
            h="calc(100% - 120px)"
            mt={7}
            showAction={false}
            title="No Data available"
            subTitle="Currently, there is no available data to display in this section."
          />
        )}
      </CustomSkeleton>
    </Box>
  );
};

export { TransactionsVaultPage };
