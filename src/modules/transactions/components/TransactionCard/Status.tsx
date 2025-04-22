import {
  Badge,
  BoxProps,
  CircularProgress,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { WitnessStatus } from 'bakosafe';

import { TransactionState } from '@/modules/core';

interface TransactionCardStatusProps extends BoxProps {
  status: TransactionState;
  transaction: ITransaction;
  showDescription?: boolean;
}

import { useMemo } from 'react';

import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';

import { useTransactionState } from '../../states';

const Status = ({
  transaction,
  status,
  showDescription = true,
  ...rest
}: TransactionCardStatusProps) => {
  const { isReproved, isCompleted, isError, isCanceled } = status;

  const signaturesCount =
    transaction!.resume?.witnesses?.filter((w) =>
      [WitnessStatus.DONE, WitnessStatus.CANCELED].includes(w.status),
    ).length ?? 0;

  const signatureStatus = `${signaturesCount}/${transaction.resume.requiredSigners} Sgd`;

  const { isCurrentTxPending } = useTransactionState();

  const isCurrentTxLoading =
    isCurrentTxPending.isPending &&
    transaction.id === isCurrentTxPending.transactionId;

  const badgeColor = useMemo(() => {
    if (isReproved || isError) return 'error';
    if (isCompleted) return 'success';
    if (isCanceled) return 'grey';
    return 'warning';
  }, [isReproved, isCompleted, isError, isCanceled]);

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
            variant={badgeColor}
          >
            {isError && 'Error'}
            {isReproved && 'Declined'}
            {isCanceled && 'Canceled'}
            {isCompleted && !isError && 'Completed'}
            {!isCompleted &&
              !isReproved &&
              !isError &&
              !isCanceled &&
              signatureStatus}
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
