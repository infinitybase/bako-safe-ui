import { Box, Text } from 'bako-ui';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { CustomSkeleton, TransactionFilters } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { TransactionCard, WaitingSignatureBadge } from '@/modules/transactions';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

const HomeTransactions = () => {
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1 });
  const {
    homeTransactions: {
      transactions,
      request: { isLoading, fetchNextPage, hasNextPage, isFetching },
      filter: {
        filter,
        handleAllAction,
        handleIncomingAction,
        handleOutgoingAction,
        txFilterType,
        handlePendingStatusChange,
      },
    },
    pendingSignerTransactions,
  } = useTransactionsContext();

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      requests: { latestPredicates },
    },
    screenSizes: { isMobile, isExtraSmall },
  } = useWorkspaceContext();

  const isPendingTransaction = useMemo(
    () =>
      pendingSignerTransactions?.data?.ofUser
        ? pendingSignerTransactions?.data?.ofUser > 0
        : false,
    [pendingSignerTransactions],
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <Box w="full" mt={{ base: 16, sm: 8 }}>
      <Box
        w="full"
        display="flex"
        flexDir="row"
        alignItems="center"
        gap={4}
        justifyContent="space-between"
        mb={4}
      >
        <Box
          display="flex"
          flexDir="row"
          alignItems="center"
          gap={{ base: 2, md: 4 }}
        >
          <Text as="h2" fontWeight="semibold" fontSize="sm" color="textPrimary">
            Transactions
          </Text>
          <WaitingSignatureBadge
            isLoading={pendingSignerTransactions.isLoading}
            quantity={pendingSignerTransactions.data?.ofUser ?? 0}
          />
        </Box>

        <TransactionFilters
          status={filter}
          currentFilter={txFilterType}
          onIncomingFilter={handleIncomingAction}
          onOutgoingFilter={handleOutgoingAction}
          isPendingSignerTransaction={isPendingTransaction}
          onAllFilter={handleAllAction}
          onPendingFilter={handlePendingStatusChange}
          justifyContent="flex-end"
        />
      </Box>

      {!isLoading && !transactions?.length && (
        <EmptyState
          h="full"
          showAction={false}
          title="No Data available"
          subTitle="Currently, there is no available data to display in this section."
        />
      )}

      {!!transactions?.length &&
        transactions?.map((grouped) => (
          <Box key={grouped.day}>
            <TransactionCard.GroupDay day={grouped.day} />

            <TransactionCard.List
              gap={4}
              mt={isExtraSmall ? 0 : 3}
              mb={transactions.length >= 1 ? 0 : 12}
            >
              <CustomSkeleton loading={latestPredicates.isLoading}>
                {grouped?.transactions.map((transaction) => (
                  <TransactionCard.Item
                    w="full"
                    key={transaction.id}
                    isMobile={isMobile}
                    transaction={transaction}
                    userInfos={userInfos}
                  />
                ))}
              </CustomSkeleton>
            </TransactionCard.List>
          </Box>
        ))}

      <Box ref={inViewRef} />
    </Box>
  );
};
export default HomeTransactions;
