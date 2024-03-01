import {
  Badge,
  Button,
  CircularProgress,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ITransaction, TransactionStatus } from 'bsafe';

import { TransactionState } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';

interface TransactionCardStatusProps {
  status: TransactionState;
  transaction: ITransaction;
  showDescription?: boolean;
}

import { useSignTransaction } from '../../hooks/signature';

const Status = ({
  transaction,
  status,
  showDescription,
}: TransactionCardStatusProps) => {
  const { isReproved, isCompleted, isError } = status;
  const { retryTransaction, isLoading } = useSignTransaction({
    transaction: transaction!,
  });
  const { isMobile } = useScreenSize();

  const signaturesCount =
    transaction!.resume?.witnesses!.filter((w) => !!w).length ?? 0;

  const signatureStatus = `${signaturesCount}/${transaction.resume.requiredSigners} Sgd`;
  const isPending = [
    TransactionStatus.PROCESS_ON_CHAIN,
    TransactionStatus.PENDING_SENDER,
  ].includes(transaction.status);

  const showRetry = !isMobile && isError;

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
      <VStack
        hidden={isPending}
        minW={100}
        spacing={0}
        w="full"
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
          <Text variant="description" fontSize="sm" color="grey.500">
            Transfer status
          </Text>
        )}

        {showRetry && (
          <Button
            h={7}
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
      </VStack>
    </HStack>
  );
};

export { Status };
