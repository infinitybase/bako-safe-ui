import { Box, VStack, Text, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useTransactionList } from '../hooks';
import { DateRangeFilter } from '../components';
import { TransactionCard } from '../components/TransactionCard';

const TransactionHistoryPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const {
    lists: { transactions },
    request: { isLoading, isFetching },
    transactionsRef,
    filter,
    handlers,
  } = useTransactionList({
    workspaceId,
  });

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Histórico de Transações
          </Text>
          
          <DateRangeFilter
            dateFrom={filter.dateFrom}
            dateTo={filter.dateTo}
            onDateRangeChange={handlers.updateDateFilter}
          />
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <Spinner size="lg" />
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {transactions.map((dayGroup, dayIndex) => (
              <Box key={dayGroup.date}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2}>
                  {dayGroup.date}
                </Text>
                {dayGroup.transactions.map((transaction, txIndex) => {
                  const isLastTransaction = 
                    dayIndex === transactions.length - 1 && 
                    txIndex === dayGroup.transactions.length - 1;
                  
                  return (
                    <Box
                      key={transaction.id}
                      ref={isLastTransaction ? transactionsRef : undefined}
                    >
                      <TransactionCard
                        transaction={transaction}
                        onSelect={() => handlers.setSelectedTransaction(transaction)}
                        isSelected={handlers.selectedTransaction?.id === transaction.id}
                      />
                    </Box>
                  );
                })}
              </Box>
            ))}
            
            {isFetching && (
              <Box display="flex" justifyContent="center" py={4}>
                <Spinner />
              </Box>
            )}
            
            {transactions.length === 0 && !isLoading && (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">
                  {filter.dateFrom || filter.dateTo 
                    ? 'Nenhuma transação encontrada no período selecionado'
                    : 'Nenhuma transação encontrada'
                  }
                </Text>
              </Box>
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export { TransactionHistoryPage };