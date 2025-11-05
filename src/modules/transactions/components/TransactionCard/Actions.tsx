import {
  Accordion,
  Badge,
  Button,
  HStack,
  Icon,
  Spacer,
  StackProps,
} from 'bako-ui';
import { TransactionType } from 'bakosafe';
import { memo, useCallback, useMemo } from 'react';

import { ErrorIcon, SuccessIcon } from '@/components';
import { TransactionState } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useTransactionsContext } from '../../providers/TransactionsProvider';
import { ITransactionWithType } from '../../services';

interface ActionsMobileProps {
  isPossibleToSign: boolean;
}

interface TransactionActionsProps extends StackProps {
  status: TransactionState;
  transaction?: ITransactionWithType;
  isInTheVaultPage?: boolean;
  isSigner: boolean;
  callBack?: () => void;
}

const ActionsMobile = memo(({ isPossibleToSign }: ActionsMobileProps) => {
  return (
    <Button
      alignSelf={{ base: 'stretch', sm: 'flex-end' }}
      fontWeight="semibold"
      variant={isPossibleToSign ? 'solid' : 'subtle'}
      size="xs"
      px={3}
    >
      {isPossibleToSign ? 'Sign' : 'Details'}
    </Button>
  );
});

ActionsMobile.displayName = 'Transaction Card Actions Mobile';

const Actions = memo(
  ({
    transaction,
    status,
    isSigner,
    callBack,
    ...rest
  }: TransactionActionsProps) => {
    const {
      screenSizes: { isMobile },
    } = useWorkspaceContext();
    const {
      signTransaction: {
        confirmTransaction,
        declineTransaction,
        selectedTransaction,
        isLoading,
        isSuccess,
      },
    } = useTransactionsContext();

    const {
      isSigned,
      isDeclined,
      isCompleted,
      isReproved,
      isCanceled,
      isPendingProvider,
      isError,
    } = status;

    const awaitingAnswer = useMemo(
      () =>
        !isSigned &&
        !isDeclined &&
        !isCompleted &&
        !isReproved &&
        !isPendingProvider &&
        !!transaction,
      [
        isSigned,
        isDeclined,
        isCompleted,
        isReproved,
        transaction,
        isPendingProvider,
      ],
    );

    const notAnswered = useMemo(
      () =>
        !isSigned && !isDeclined && (isCompleted || isCanceled || isReproved),
      [isSigned, isDeclined, isCompleted, isCanceled, isReproved],
    );

    const isTxActionsInLoading = useMemo(
      () => isLoading && selectedTransaction?.id === transaction?.id,
      [isLoading, selectedTransaction?.id, transaction?.id],
    );

    const showActionsButtons = useMemo(
      () => !isError && !isCanceled && awaitingAnswer && isSigner,
      [isError, isCanceled, awaitingAnswer, isSigner],
    );

    const disableActionButtons =
      isSuccess && !awaitingAnswer
        ? false
        : isLoading && selectedTransaction
          ? !isTxActionsInLoading
          : false;

    const isDeposit = transaction?.type === TransactionType.DEPOSIT;

    const handleConfirm = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        transaction &&
          confirmTransaction(transaction.id, callBack, transaction);
      },
      [confirmTransaction, transaction, callBack],
    );

    const handleDecline = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        transaction && declineTransaction(transaction.hash);
      },
      [declineTransaction, transaction],
    );

    return (
      <HStack minW={{ md: 140 }} justifySelf="end" {...rest}>
        {isSigned && (
          <Badge
            h={6}
            rounded="sm"
            px={2}
            variant="subtle"
            colorPalette={isCanceled ? 'gray' : 'green'}
            css={
              isCanceled
                ? {
                    bg: 'bg.muted/50',
                    color: 'textSecondary',
                  }
                : {}
            }
          >
            You {isCanceled ? 'canceled' : 'signed'}
            {!isCanceled && <Icon as={SuccessIcon} w={4} color="green" />}
          </Badge>
        )}

        {isDeclined && (
          <Badge
            h={6}
            variant="subtle"
            rounded="sm"
            px={2}
            colorPalette="red"
            bg="red.300/5"
          >
            You declined
            <Icon as={ErrorIcon} w={4} />
          </Badge>
        )}

        {!isDeposit && notAnswered && (
          <Badge
            h={6}
            variant="subtle"
            rounded="sm"
            px={2}
            bg="bg.muted/60"
            color="textPrimary"
          >
            {`You didn't sign`}
          </Badge>
        )}

        {isMobile && <ActionsMobile isPossibleToSign={showActionsButtons} />}

        {!isMobile && showActionsButtons ? (
          <HStack
            minW={{ base: 140, sm: 100, xl: 140 }}
            flexDirection="row-reverse"
          >
            <Button
              h={9}
              px={3}
              aria-label={'Sign btn tx card'}
              size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
              loading={isTxActionsInLoading}
              disabled={disableActionButtons}
              onClick={handleConfirm}
            >
              Sign
            </Button>
            <Button
              h={9}
              px={3}
              aria-label={'Decline btn tx card'}
              size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
              variant="subtle"
              onClick={handleDecline}
              loading={isTxActionsInLoading}
              disabled={disableActionButtons}
            >
              Decline
            </Button>
          </HStack>
        ) : (
          <Spacer />
        )}

        <Accordion.ItemIndicator
          display={{
            base: 'none',
            sm: 'block',
          }}
        />
      </HStack>
    );
  },
);

Actions.displayName = 'Transaction Card Actions';

export { Actions, ActionsMobile };
