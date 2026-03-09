import { Box, VStack } from '@chakra-ui/react';
import { useTransactionList } from '../hooks/list/useTransactionList';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { TransactionList } from '../components/TransactionList';

interface HistoryPageProps {
  workspaceId?: string;
}

export const HistoryPage = ({ workspaceId }: HistoryPageProps) => {
  const {
    handlers: {
      handleApplyDateFilter,
      handleClearDateFilter,
    },
    filter: {
      dateFilter,
      dateFilterError,
    },
    lists: {
      transactions,
    },
    request: {
      isLoading,
    },
    transactionsRef,
  } = useTransactionList({ workspaceId });

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <DateRangeFilter
          onApplyFilter={handleApplyDateFilter}
          onClearFilter={handleClearDateFilter}
          error={dateFilterError}
          dateFilter={dateFilter}
        />
        
        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          ref={transactionsRef}
        />
      </VStack>
    </Box>
  );
};