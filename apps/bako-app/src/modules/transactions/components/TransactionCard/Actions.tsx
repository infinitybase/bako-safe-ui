import {
  Badge,
  BoxProps,
  Button,
  HStack,
  Icon,
  Spacer,
  useAccordionItemState,
} from '@chakra-ui/react';
import { ITransactionWithType } from '@services/modules/transaction';
import { ErrorIcon, SuccessIcon } from '@bako-safe/ui/components';
import { TransactionType } from 'bakosafe';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { TransactionState } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useTransactionsContext } from '../../providers/TransactionsProvider';
import { ActionsMobile } from './ActionsMobile';

interface TransactionActionsProps extends BoxProps {
  status: TransactionState;
  transaction?: ITransactionWithType;
  isInTheVaultPage?: boolean;
  isSigner: boolean;
  callBack?: () => void;
}

const Actions = ({
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

  const { isSigned, isDeclined, isCompleted, isReproved } = status;

  const awaitingAnswer =
    !isSigned && !isDeclined && !isCompleted && !isReproved && transaction;
  const notAnswered = !isSigned && !isDeclined && (isCompleted || isReproved);

  const isTxActionsInLoading =
    isLoading && selectedTransaction?.id === transaction?.id;

  const disableActionButtons =
    isSuccess && !awaitingAnswer
      ? false
      : isLoading && selectedTransaction
        ? !isTxActionsInLoading
        : false;

  const isDeposit = transaction?.type === TransactionType.DEPOSIT;

  if (isMobile) {
    return <ActionsMobile awaitingAnswer={awaitingAnswer} />;
  }

  return (
    <HStack minW={140} justifySelf="end" {...rest}>
      {isSigned && (
        <Badge h={6} rounded="full" px={2} variant="success">
          You signed
          <Icon as={SuccessIcon} color="success.700" />
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

      {awaitingAnswer && isSigner ? (
        <HStack minW={{ base: 140, sm: 100, xl: 140 }}>
          <Button
            h={9}
            px={3}
            variant="primary"
            size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
            fontSize={{ base: 'unset', sm: 14, lg: 'unset' }}
            isLoading={isTxActionsInLoading}
            isDisabled={disableActionButtons}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              confirmTransaction(transaction.id, callBack);
            }}
          >
            Sign
          </Button>
          <Button
            h={9}
            px={3}
            size={{ base: 'sm', sm: 'xs', lg: 'sm' }}
            fontSize={{ base: 'unset', sm: 14, lg: 'unset' }}
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              declineTransaction(transaction.hash);
            }}
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
};

export { Actions };
