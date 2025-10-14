import { Box, Button, Icon, Spacer, Text } from 'bako-ui';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { CustomSkeleton } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Pages, shakeAnimationX } from '@/modules/core';
import { TransactionCard, WaitingSignatureBadge } from '@/modules/transactions';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';

import { useWorkspaceContext } from '../../WorkspaceProvider';

const WkHomeTransactions = () => {
  const [hasTransactions, setHasTransactions] = useState(false);

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { navigate },
      requests: { latestPredicates },
    },
    screenSizes: { isSmall, isMobile, isExtraSmall },
  } = useWorkspaceContext();

  const workspaceId = userInfos.workspace?.id ?? '';

  const {
    homeTransactions: {
      transactions,
      request: { isLoading },
    },
    pendingSignerTransactions,
  } = useTransactionsContext();

  useEffect(() => {
    if (transactions && transactions.length >= 1 && !hasTransactions) {
      setHasTransactions(true);
    }
  }, [transactions]);

  return (
    <Box w="full" mt={{ base: 16, sm: 8 }}>
      <Box
        w="full"
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
        <Spacer />

        {hasTransactions && (
          <Button
            color="grey.75"
            colorPalette="txFilterType"
            alignSelf={{ base: 'stretch', sm: 'flex-end' }}
            onClick={() =>
              navigate(
                Pages.userTransactions({
                  workspaceId,
                }),
              )
            }
            css={`
              &:hover .btn-icon {
                animation: ${shakeAnimationX} 0.5s ease-in-out;
              }
            `}
            px={isExtraSmall ? 3 : 4}
          >
            <Icon
              as={MdKeyboardArrowRight}
              fontSize="lg"
              ml={isSmall ? -1 : 0}
              className="btn-icon"
            />
            View all
          </Button>
        )}
      </Box>

      {!isLoading && !transactions?.length && <EmptyState showAction={false} />}

      {transactions?.map((grouped) => (
        <Box key={grouped.monthYear}>
          <TransactionCard.GroupMonth monthYear={grouped.monthYear} />
          <TransactionCard.List gap={4} mt={isExtraSmall ? 0 : 7} mb={12}>
            <CustomSkeleton loading={latestPredicates.isLoading}>
              {grouped?.transactions.map((transaction) => (
                <TransactionCard.Item
                  key={transaction.id}
                  transaction={transaction}
                  isMobile={isMobile}
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
export default WkHomeTransactions;
