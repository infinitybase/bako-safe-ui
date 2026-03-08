import { Box, VStack } from '@chakra-ui/react';
import { useTransactionList } from '../hooks/list/useTransactionList';
import { TransactionList } from '../components/TransactionList';
import { DateRangeFilter } from '../components/DateRangeFilter';

export const HistoryPage = () => {
  const {
    lists: { transactions },
    request: { isLoading, isFetching },
    handlers: {
      handleApplyDateFilter,
      handleClearDateFilter,
    },
    filter: {
      dateFilter,
      dateFilterError,
    },
    transactionsRef,
  } = useTransactionList();

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <DateRangeFilter
          onApplyFilter={handleApplyDateFilter}
          onClearFilter={handleClearDateFilter}
          error={dateFilterError}
          dateFrom={dateFilter.dateFrom}
          dateTo={dateFilter.dateTo}
        />
        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          isFetching={isFetching}
          lastElementRef={transactionsRef}
        />
      </VStack>
    </Box>
  );
};