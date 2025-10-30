import {
  Badge,
  BoxProps,
  Button,
  HStack,
  Icon,
  Spacer,
  useAccordionItemState,
} from '@chakra-ui/react';
import { TransactionType } from 'bakosafe';
import { memo, useCallback, useMemo } from 'react';
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from 'react-icons/io';

import { ErrorIcon, SuccessIcon } from '@/components';
import { TransactionState } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useTransactionsContext } from '../../providers/TransactionsProvider';
import { ITransactionWithType } from '../../services';

interface ActionsMobileProps {
  isPossibleToSign: boolean;
}

interface TransactionActionsProps extends BoxProps {
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
    <HStack justifyContent="end" spacing={1}>
      <Button
        color={isPossibleToSign ? 'black' : 'grey.75'}
        bgColor={isPossibleToSign ? 'brand.500' : '#F5F5F50D'}
        fontWeight={isPossibleToSign ? 'bold' : 'normal'}
        border="none"
        fontSize="xs"
        letterSpacing=".5px"
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        variant="secondary"
        rightIcon={
          <Icon as={IoIosArrowForward} fontSize="md" ml={isSmall ? -1 : 0} />
        }
        px={isExtraSmall ? 3 : 4}
      >
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
    const { isOpen } = useAccordionItemState();
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
            variant={isCanceled ? 'grey' : 'success'}
          >
            You {isCanceled ? 'canceled' : 'signed'}
            {!isCanceled && <Icon as={SuccessIcon} color="success.700" />}
          </Badge>
        )}

        {isDeclined && (
          <Badge h={6} rounded="full" px={2} variant="error">
            You declined
            <Icon as={ErrorIcon} fontSize={17} />
          </Badge>
        )}

        {!isDeposit && notAnswered && (
          <Badge h={6} rounded="full" px={2} variant="info">
            {`You didn't sign`}
          </Badge>
        )}

        {showActionsButtons ? (
          <HStack minW={{ base: 140, sm: 100, xl: 140 }}>
            <Button
              h={9}
              px={3}
              aria-label={'Sign btn tx card'}
              variant="primary"
              size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
              fontSize={{ base: 'unset', sm: 14, lg: 'unset' }}
              isLoading={isTxActionsInLoading}
              isDisabled={disableActionButtons}
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
              variant="secondary"
              onClick={handleDecline}
              isLoading={isTxActionsInLoading}
              isDisabled={disableActionButtons}
            >
              Decline
            </Button>
          </HStack>
        ) : (
          <Spacer />
        )}

        <Icon
          as={isOpen ? IoIosArrowUp : IoIosArrowDown}
          fontSize="md"
          color="grey.200"
          cursor="pointer"
        />
      </HStack>
    );
  },
);

Actions.displayName = 'Transaction Card Actions';

export { Actions, ActionsMobile };
