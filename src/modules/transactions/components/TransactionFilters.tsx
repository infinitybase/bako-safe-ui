import { VStack } from '@chakra-ui/react';

import { DateRangeFilter } from './DateRangeFilter';
import { IUseTransactionList } from '../hooks/list/useTransactionList';

interface TransactionFiltersProps {
  transactionList: IUseTransactionList;
}

const TransactionFilters = ({ transactionList }: TransactionFiltersProps) => {
  const {
    filter: { dateFilter },
    handlers: {
      handleDateFromChange,
      handleDateToChange,
      handleClearDateFilters,
    },
  } = transactionList;

  return (
    <VStack spacing={4} align="stretch">
      <DateRangeFilter
        dateFrom={dateFilter.dateFrom}
        dateTo={dateFilter.dateTo}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onClearFilters={handleClearDateFilters}
      />
    </VStack>
  );
};

export { TransactionFilters };