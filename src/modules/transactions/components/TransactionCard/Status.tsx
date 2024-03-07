import {
  Badge,
  Button,
  CircularProgress,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ITransaction, TransactionStatus } from 'bsafe';

import { TransactionState } from '@/modules/core';

interface TransactionCardStatusProps {
  status: TransactionState;
  transaction: ITransaction;
  showDescription?: boolean;
}

import { useSignTransaction } from '../../hooks/signature';

const Status = ({
  transaction,
  status,
  showDescription = true,
}: TransactionCardStatusProps) => {
  const { isReproved, isCompleted, isError } = status;
  const { retryTransaction, isLoading } = useSignTransaction({
    transaction: transaction!,
  });

  const signaturesCount =
    transaction!.resume?.witnesses?.filter((w) => w != null).length ?? 0;

  const signatureStatus = `${signaturesCount}/${transaction.resume.requiredSigners} Sgd`;
  const isPending = [
    TransactionStatus.PROCESS_ON_CHAIN,
    TransactionStatus.PENDING_SENDER,
  ].includes(transaction.status);

  return (
    <HStack
      w="full"
      justifyContent={{ base: 'end', sm: 'center' }}
      ml={{ base: 0, sm: 6 }}
    >
      {isLoading && (
        <CircularProgress
          trackColor="dark.100"
          size={30}
          isIndeterminate
          color="brand.500"
        />
      )}
      <Stack
        hidden={isPending}
        minW={100}
        spacing={[2, 0]}
        w="full"
        direction={['row', 'column']}
        alignItems={{ base: 'end', sm: 'center' }}
        justifyContent="center"
      >
        <Badge
          h={5}
          variant={
            isReproved || isError
              ? 'error'
              : isCompleted
              ? 'success'
              : 'warning'
          }
        >
          {isError && 'Error'}
          {isReproved && 'Declined'}
          {isCompleted && !isError && 'Completed'}
          {!isCompleted && !isReproved && !isError && signatureStatus}
        </Badge>
        {showDescription && (
          <Text variant="description" fontSize={['xs', 'sm']} color="grey.500">
            Transfer status
          </Text>
        )}

        {isError && (
          <Button
            h={[6, 7]}
            variant="secondary"
            px={3}
            bgColor="dark.100"
            border="none"
            isLoading={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              retryTransaction();
            }}
          >
            Retry
          </Button>
        )}
      </Stack>
    </HStack>
  );
};

export { Status };
