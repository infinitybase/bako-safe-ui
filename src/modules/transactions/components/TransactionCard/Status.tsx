import { HStack, Loader, StackProps, Text, VStack } from 'bako-ui';
import { WitnessStatus } from 'bakosafe';

import { TransactionState } from '@/modules/core';

interface TransactionCardStatusProps extends StackProps {
  status: TransactionState;
  transaction: ITransaction;
  showDescription?: boolean;
}

import { memo, useMemo } from 'react';

import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';

import { useTransactionState } from '../../states';

const Status = memo(
  ({
    transaction,
    status,
    showDescription = true,
    ...rest
  }: TransactionCardStatusProps) => {
    const { isCurrentTxPending } = useTransactionState();
    const { isReproved, isCompleted, isError, isCanceled, isPendingProvider } =
      status;

    const signaturesCount =
      transaction!.resume?.witnesses?.filter((w) =>
        [WitnessStatus.DONE, WitnessStatus.CANCELED].includes(w.status),
      ).length ?? 0;

    const signatureStatus = `${signaturesCount}/${transaction.resume.requiredSigners} Sgd`;

    const isCurrentTxLoading =
      isCurrentTxPending.isPending &&
      transaction.id === isCurrentTxPending.transactionId;

    const textColor = useMemo(() => {
      if (isReproved || isError) return 'red';
      if (isCompleted) return 'textPrimary';
      if (isCanceled) return 'textSecondary';
      return 'primary.main';
    }, [isReproved, isCompleted, isError, isCanceled]);

    return (
      <HStack
        justifyContent={{ base: 'flex-end', sm: 'center' }}
        ml={{ base: 0, sm: 6 }}
        maxW="full"
        {...rest}
      >
        {isCurrentTxLoading && (
          <Loader
            css={{ '--spinner-track-color': 'dark.100' }}
            size="lg"
            color="brand.500"
          />
        )}
        <VStack
          hidden={isCurrentTxLoading}
          minW={{ md: 100 }}
          gap={0}
          w="full"
          direction={{ base: 'row', sm: 'column' }}
          alignItems={{ base: 'flex-end', md: 'center' }}
          justifyContent="flex-end"
        >
          <Text
            fontSize="xs"
            lineHeight="shorter"
            fontWeight="medium"
            letterSpacing="wider"
            color={textColor}
          >
            {isError && 'Error'}
            {isReproved && 'Declined'}
            {isCanceled && 'Canceled'}
            {isCompleted && !isError && 'Completed'}
            {isPendingProvider && 'Waiting Provider'}
            {!isCompleted &&
              !isReproved &&
              !isError &&
              !isCanceled &&
              !isPendingProvider &&
              signatureStatus}
          </Text>

          {showDescription && (
            <Text fontSize="xs" color="gray.400" lineHeight="shorter">
              Transfer status
            </Text>
          )}
        </VStack>
      </HStack>
    );
  },
);

Status.displayName = 'TransactionStatus';

export { Status };
