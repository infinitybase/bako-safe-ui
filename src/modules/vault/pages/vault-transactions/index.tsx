import { Box, HStack, Icon, Text, VStack } from 'bako-ui';
import { useEffect } from 'react';

import {
  CustomSkeleton,
  LineCloseIcon,
  TransactionFilters,
} from '@/components';
import { EmptyState } from '@/components/emptyState';
import { TransactionCard } from '@/modules/transactions/components';
import { useTransactionSocketListener } from '@/modules/transactions/hooks/events/useTransactionsSocketListener';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useVaultInfosContext } from '@/modules/vault/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { StatusFilter } from '../../../transactions/hooks';
import { vaultInfinityQueryKey } from '../../hooks/list/useVaultTransactionsRequest';

const TransactionsVaultPage = () => {
  const {
    authDetails: { userInfos },
    screenSizes: { isMobile },
  } = useWorkspaceContext();

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
        handleAllAction,
        handlePendingStatusChange,
      },
      request: { isLoading },
    },
    isPendingSigner,
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
      {/* FILTER */}
      <HStack gap={3}>
        <TransactionFilters
          status={filter.value}
          currentFilter={filter.txFilterType}
          onIncomingFilter={handleIncomingAction}
          onOutgoingFilter={handleOutgoingAction}
          isPendingSignerTransaction={isPendingSigner}
          onAllFilter={handleAllAction}
          onPendingFilter={handlePendingStatusChange}
          inverse
        />
        {selectedTransaction.id && (
          <HStack gap={2}>
            <Text color="primary.main">{selectedTransaction.name}</Text>
            <Box
              onClick={() => {
                setSelectedTransaction({});
                filter.set(StatusFilter.ALL);
              }}
              cursor="pointer"
            >
              <Icon as={LineCloseIcon} fontSize="18px" color="primary.main" />
            </Box>
          </HStack>
        )}
      </HStack>

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
              <Box key={grouped.day} w="full">
                <TransactionCard.GroupDay day={grouped.day} mb={2} />
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
