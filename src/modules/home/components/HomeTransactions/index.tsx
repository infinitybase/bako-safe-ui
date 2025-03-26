import { Box, Button, Icon, Spacer, Text } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { CustomSkeleton } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Pages, shakeAnimationX } from '@/modules/core';
import { TransactionCard, WaitingSignatureBadge } from '@/modules/transactions';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
              variant="txFilterType"
              alignSelf={{ base: 'stretch', sm: 'flex-end' }}
              rightIcon={
                <Icon
                  as={MdKeyboardArrowRight}
                  fontSize="lg"
                  ml={isSmall ? -1 : 0}
                  className="btn-icon"
                />
              }
              onClick={() =>
                navigate(
                  Pages.userTransactions({
                    workspaceId: userInfos.workspace?.id,
                  }),
                )
              }
              css={css`
                &:hover .btn-icon {
                  animation: ${shakeAnimationX} 0.5s ease-in-out;
                }
              `}
              px={isExtraSmall ? 3 : 4}
            >
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
          <Box key={grouped.monthYear}>
            <TransactionCard.GroupMonth monthYear={grouped.monthYear} />

            <TransactionCard.List
              spacing={4}
              mt={isExtraSmall ? 0 : 3}
              mb={transactions.length >= 1 ? 0 : 12}
            >
              <CustomSkeleton isLoaded={!latestPredicates.isLoading}>
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
