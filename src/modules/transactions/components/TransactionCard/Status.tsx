import {
  Badge,
  Button,
  CircularProgress,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ITransaction, TransactionStatus } from 'bakosafe';

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
      justifyContent={{ base: 'flex-end', sm: 'center' }}
      ml={{ base: 0, sm: 6 }}
      maxW="full"
    >
      {isLoading && (
        <CircularProgress
          trackColor="dark.100"
          size={30}
          isIndeterminate
          color="brand.500"
        />
      )}
      <VStack
        hidden={isPending}
        minW={100}
        spacing={0}
        w="full"
        direction={{ base: 'row', sm: 'column' }}
        alignItems={{ base: 'flex-end', md: 'center' }}
        justifyContent="flex-end"
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
          <Text
            variant="description"
            fontSize={{ base: 'xs', sm: 'sm' }}
            color="grey.500"
          >
            Transfer status
          </Text>
        )}

        {isError && (
          <Button
            h={7}
            variant="secondary"
            px={3}
            bgColor="dark.100"
            mt={{ base: 4, sm: 1 }}
            size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
            fontSize={{ base: 'unset', sm: 14, lg: 'unset' }}
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
      </VStack>
    </HStack>
  );
};

export { Status };
