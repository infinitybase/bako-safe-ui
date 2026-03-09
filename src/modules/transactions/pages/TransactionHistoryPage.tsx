import { useState, useCallback } from 'react';
import { Box, VStack, HStack, Text, Spinner, Center } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useGetParams } from '@/modules/core';
import { TransactionCard } from '../components';
import { DateRangeFilter } from '../components/filters';
import { useTransactionList } from '../hooks';
import { TransactionTypeFilter } from '../components/filter';

const TransactionHistoryPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();

  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const handleDateRangeChange = useCallback((newDateFrom?: string, newDateTo?: string) => {
    setDateFrom(newDateFrom);
    setDateTo(newDateTo);
  }, []);

  const {
    lists: { transactions },
    request: { isLoading, isFetching },
    handlers: {
      selectedTransaction,
      setSelectedTransaction,
      handleIncomingAction,
      handleOutgoingAction,
      listTransactionTypeFilter,
    },
    filter: { set: setFilter, value: filter, txFilterType },
    transactionsRef,
  } = useTransactionList({
    workspaceId: workspaceId || '',
    dateFrom,
    dateTo,
  });

  if (isLoading && !transactions.length) {
    return (
      <Center h="200px">
        <Spinner size="lg" />
      </Center>
    );
  }

  const hasDateFilter = dateFrom && dateTo;
  const showNoResultsMessage = transactions.length === 0 && !isLoading;
  const noResultsText = hasDateFilter 
    ? 'Nenhuma transação encontrada no período selecionado'
    : 'Nenhuma transação encontrada';

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Histórico de Transações
          </Text>
          
          <VStack spacing={4} align="stretch">
            <DateRangeFilter
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateRangeChange={handleDateRangeChange}
            />
            
            <HStack spacing={4}>
              <TransactionTypeFilter
                txFilterType={txFilterType}
                handleIncomingAction={handleIncomingAction}
                handleOutgoingAction={handleOutgoingAction}
                listTransactionTypeFilter={listTransactionTypeFilter}
              />
            </HStack>
          </VStack>
        </Box>

        <Box>
          {showNoResultsMessage ? (
            <Center h="200px">
              <Text color="gray.500">{noResultsText}</Text>
            </Center>
          ) : (
            <VStack spacing={4} align="stretch">
              {transactions.map((dayGroup, dayIndex) => (
                <Box key={dayIndex}>
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    {dayGroup.date}
                  </Text>
                  {dayGroup.transactions.map((transaction, txIndex) => {
                    const isLast = dayIndex === transactions.length - 1 && 
                                   txIndex === dayGroup.transactions.length - 1;
                    return (
                      <Box
                        key={transaction.id}
                        ref={isLast ? transactionsRef : undefined}
                      >
                        <TransactionCard
                          transaction={transaction}
                          isSelected={selectedTransaction?.id === transaction.id}
                          onSelect={() => setSelectedTransaction(transaction)}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ))}
              
              {isFetching && (
                <Center py={4}>
                  <Spinner size="md" />
                </Center>
              )}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export { TransactionHistoryPage };