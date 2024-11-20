import {
  Badge,
  type BoxProps,
  CircularProgress,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { WitnessStatus } from 'bakosafe';

interface TransactionCardStatusProps extends BoxProps {
  status: TransactionState;
  transaction: ITransaction;
  showDescription?: boolean;
}

import type { ITransaction } from '@bako-safe/services';

import { useTransactionState } from '../../states';
import type { TransactionState } from '../../types';

const Status = ({
  transaction,
  status,
  showDescription = true,
  ...rest
}: TransactionCardStatusProps) => {
  const { isReproved, isCompleted, isError } = status;

  const signaturesCount =
    transaction?.resume?.witnesses?.filter(
      (w) => w.status === WitnessStatus.DONE,
    ).length ?? 0;

  const signatureStatus = `${signaturesCount}/${transaction.resume.requiredSigners} Sgd`;

  const { isCurrentTxPending } = useTransactionState();

  const isCurrentTxLoading =
    isCurrentTxPending.isPending &&
    transaction.id === isCurrentTxPending.transactionId;

  return (
    <HStack
      justifyContent={{ base: 'flex-end', sm: 'center' }}
      ml={{ base: 0, sm: 6 }}
      maxW="full"
      {...rest}
    >
      {isCurrentTxLoading && (
        <CircularProgress
          trackColor="dark.100"
          size={30}
          isIndeterminate
          color="brand.500"
        />
      )}
      <VStack
        hidden={isCurrentTxLoading}
        minW={100}
        spacing={0}
        w="full"
        direction={{ base: 'row', sm: 'column' }}
        alignItems={{ base: 'flex-end', md: 'center' }}
        justifyContent="flex-end"
      >
        <HStack position="relative">
          <Badge
            minW={'80px'}
            display="flex"
            alignItems="center"
            fontSize="xs"
            justifyContent={'center'}
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
