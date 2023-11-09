import { Badge, Box, CircularProgress, Text, VStack } from '@chakra-ui/react';
import { TransactionStatus } from 'bsafe';

import { Transaction, TransactionState, WitnessStatus } from '@/modules/core';

interface TransactionCardStatusProps {
  status: TransactionState;
  transaction: Transaction;
}

/* TODO: Fix this to use BSAFE SDK */
const Status = ({ transaction, status }: TransactionCardStatusProps) => {
  const { isReproved, isCompleted, isError } = status;

  const signaturesCount = transaction.witnesses.filter(
    (w) => w?.status === WitnessStatus.DONE,
  ).length;

  const signatureStatus = `${signaturesCount}/${transaction.predicate.minSigners} Sgd`;

  if (
    [
      TransactionStatus.PROCESS_ON_CHAIN,
      TransactionStatus.PENDING_SENDER,
    ].includes(transaction.status)
  ) {
    return (
      <Box minW={100}>
        <CircularProgress
          trackColor="dark.100"
          size={30}
          isIndeterminate
          color="brand.500"
        />
      </Box>
    );
  }

  return (
    <VStack minW={100} spacing={0}>
      <Badge
        h={5}
        variant={
          isReproved || isError ? 'error' : isCompleted ? 'success' : 'warning'
        }
      >
        {isError && 'Error'}
        {isReproved && 'Declined'}
        {isCompleted && !isError && 'Completed'}
        {!isCompleted && !isReproved && !isError && signatureStatus}
      </Badge>
      <Text variant="description" fontSize="sm" color="grey.500">
        Transfer status
      </Text>
    </VStack>
  );
};

export { Status };
