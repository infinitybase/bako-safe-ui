import { Box, Text, VStack, Spinner, Center } from '@chakra-ui/react';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';

interface TransactionListProps {
  transactions: Array<{
    date: string;
    transactions: ITransaction[];
  }>;
  isLoading: boolean;
  isFetching: boolean;
  lastElementRef: (node: HTMLDivElement) => void;
}

export const TransactionList = ({
  transactions,
  isLoading,
  isFetching,
  lastElementRef,
}: TransactionListProps) => {
  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (transactions.length === 0) {
    return (
      <Center py={8}>
        <Text color="gray.500">Nenhuma transação encontrada no período</Text>
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {transactions.map((group, groupIndex) => (
        <Box key={group.date}>
          <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={3}>
            {group.date}
          </Text>
          <VStack spacing={2} align="stretch">
            {group.transactions.map((transaction, txIndex) => {
              const isLast = groupIndex === transactions.length - 1 && 
                           txIndex === group.transactions.length - 1;
              
              return (
                <Box
                  key={transaction.id}
                  ref={isLast ? lastElementRef : undefined}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  bg="white"
                  shadow="sm"
                >
                  <Text fontWeight="medium">{transaction.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    Status: {transaction.status}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </Text>
                </Box>
              );
            })}
          </VStack>
        </Box>
      ))}
      {isFetching && (
        <Center py={4}>
          <Spinner size="md" />
        </Center>
      )}
    </VStack>
  );
};