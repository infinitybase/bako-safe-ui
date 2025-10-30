import { Box, Button, Spacer, Text } from 'bako-ui';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { CustomSkeleton } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Pages } from '@/modules/core';
import { TransactionCard, WaitingSignatureBadge } from '@/modules/transactions';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

const HomeTransactions = () => {
  const [hasTransactions, setHasTransactions] = useState(false);

  const {
    homeTransactions: {
      transactions,
      request: { isLoading },
    },
    pendingSignerTransactions,
  } = useTransactionsContext();

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      requests: { latestPredicates },
      handlers: { navigate },
    },
    screenSizes: { isSmall, isMobile, isExtraSmall },
  } = useWorkspaceContext();

  useEffect(() => {
    if (transactions && transactions.length >= 1 && !hasTransactions) {
      setHasTransactions(true);
    }
  }, [transactions]);

  return (
    <Box w="full" mt={{ base: 16, sm: 8 }}>
      <Box
        w="full"
        h="100%"
        display="flex"
        flexDir={isSmall ? 'column' : 'row'}
        gap={4}
        mb={4}
      >
        <Box
          display="flex"
          flexDir={isSmall ? 'column' : 'row'}
          alignItems={isSmall ? 'unset' : 'center'}
          gap={isSmall ? 2 : 4}
        >
          <Text fontWeight={700} fontSize="md" color="grey.50">
            Transactions
          </Text>
          <WaitingSignatureBadge
            isLoading={pendingSignerTransactions.isLoading}
            quantity={pendingSignerTransactions.data?.ofUser ?? 0}
          />
        </Box>

        {hasTransactions && (
          <>
            <Spacer />
            <Button
              color="grey.75"
              alignSelf={{ base: 'stretch', sm: 'flex-end' }}
              onClick={() =>
                navigate(
                  Pages.userTransactions({
                    workspaceId: userInfos.workspace?.id,
                  }),
                )
              }
              // css={css`
              //   &:hover .btn-icon {
              //     animation: ${shakeAnimationX} 0.5s ease-in-out;
              //   }
              // `}
              px={isExtraSmall ? 3 : 4}
              colorPalette="txFilterType"
            >
              <MdKeyboardArrowRight fontSize="lg" className="btn-icon" />
              View all
            </Button>
          </>
        )}
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
    </Box>
  );
};
export default HomeTransactions;
