interface TransactionCardStatusProps {
  status: TransactionState;
  transaction: Transaction;
}
import { Badge, Text, VStack } from '@chakra-ui/react';

import { Transaction, TransactionState, WitnessStatus } from '@/modules/core';

const Status = ({ transaction, status }: TransactionCardStatusProps) => {
  const { isReproved, isCompleted } = status;

  const signaturesCount = transaction.witnesses.filter(
    (w) => w?.status === WitnessStatus.DONE,
  ).length;

  const signatureStatus = `${signaturesCount}/${transaction.predicate.minSigners} Sgd`;

  return (
    <VStack spacing={0}>
      <Badge
        h={5}
        variant={isReproved ? 'error' : isCompleted ? 'success' : 'warning'}
      >
        {isCompleted ? 'Completed' : isReproved ? 'Declined' : signatureStatus}
      </Badge>
      <Text variant="description" fontSize="sm" color="grey.500">
        Transfer status
      </Text>
    </VStack>
  );
};

export { Status };
