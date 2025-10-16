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
import { IoIosArrowForward } from 'react-icons/io';

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

const ActionsMobile = ({ isPossibleToSign }: ActionsMobileProps) => {
  const {
    screenSizes: { isSmall, isExtraSmall },
  } = useWorkspaceContext();

  return (
    <HStack justifyContent="end" gap={1}>
      <Button
        color={isPossibleToSign ? 'black' : 'grey.75'}
        bgColor={isPossibleToSign ? 'brand.500' : '#F5F5F50D'}
        fontWeight={isPossibleToSign ? 'bold' : 'normal'}
        border="none"
        fontSize="xs"
        letterSpacing=".5px"
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        colorPalette="secondary"
        px={isExtraSmall ? 3 : 4}
      >
        <Icon as={IoIosArrowForward} fontSize="md" ml={isSmall ? -1 : 0} />
        {isPossibleToSign ? 'Sign' : isSmall ? 'Details' : 'View Details'}
      </Button>
    </HStack>
  );
};

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
        transaction && confirmTransaction(transaction.id, callBack);
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

    if (isMobile) {
      return <ActionsMobile isPossibleToSign={showActionsButtons} />;
    }

    return (
      <HStack minW={140} justifySelf="end" {...rest}>
        {isSigned && (
          <Badge
            h={6}
            rounded="full"
            px={2}
            colorPalette={isCanceled ? 'grey' : 'success'}
          >
            You {isCanceled ? 'canceled' : 'signed'}
            {!isCanceled && <Icon as={SuccessIcon} w={4} color="success.700" />}
          </Badge>
        )}

        {isDeclined && (
          <Badge h={6} rounded="full" px={2} colorPalette="error">
            You declined
            <Icon as={ErrorIcon} w={4} />
          </Badge>
        )}

        {!isDeposit && notAnswered && (
          <Badge h={6} rounded="full" px={2} colorPalette="info">
            {`You didn't sign`}
          </Badge>
        )}

        {showActionsButtons ? (
          <HStack minW={{ base: 140, sm: 100, xl: 140 }}>
            <Button
              h={9}
              px={3}
              aria-label={'Sign btn tx card'}
              colorPalette="primary"
              size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
              fontSize={{ base: 'unset', sm: 14, lg: 'unset' }}
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
              fontSize={{ base: 'unset', sm: 14, lg: 'unset' }}
              colorPalette="secondary"
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

        <Accordion.ItemIndicator />
        {/* <Icon
          as={expanded ? IoIosArrowUp : IoIosArrowDown}
          fontSize="md"
          color="grey.200"
          cursor="pointer"
        /> */}
      </HStack>
    );
  },
);

Actions.displayName = 'Transaction Card Actions';

export { Actions, ActionsMobile };
