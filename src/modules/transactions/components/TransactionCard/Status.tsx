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
import { RefreshIcon } from '@/components/icons/refresh-icon';

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
        <HStack position="relative">
          <Badge
            minW={isError ? '110px' : '80px'}
            display="flex"
            alignItems="center"
            fontSize="xs"
            justifyContent={isError ? 'flex-start' : 'center'}
            h={6}
            borderRadius="20px"
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
          {isError && (
            <Button
              position="absolute"
              top={0}
              left={10}
              h={6}
              variant="secondary"
              px={2}
              border="1px solid #868079"
              bgColor="#F5F5F51A"
              borderRadius="20px"
              fontSize="xs"
              fontWeight="normal"
              isLoading={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                retryTransaction();
              }}
              leftIcon={<RefreshIcon fontSize="sm" />}
            >
              Retry
            </Button>
          )}
        </HStack>

        {showDescription && (
          <Text
            variant="description"
            fontSize={{ base: 'xs', sm: 'sm' }}
            color="grey.500"
          >
            Transfer status
          </Text>
        )}
      </VStack>
    </HStack>
  );
};

export { Status };
