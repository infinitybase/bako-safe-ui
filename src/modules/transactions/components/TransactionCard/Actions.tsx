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
  awaitingAnswer?: boolean | ITransactionWithType;
}

interface TransactionActionsProps extends BoxProps {
  status: TransactionState;
  transaction?: ITransactionWithType;
  isInTheVaultPage?: boolean;
  isSigner: boolean;
  callBack?: () => void;
}

const ActionsMobile = ({ awaitingAnswer }: ActionsMobileProps) => {
  const {
    screenSizes: { isSmall, isExtraSmall },
  } = useWorkspaceContext();
  return (
    <HStack justifyContent="end" spacing={1}>
      <Button
        color={awaitingAnswer ? 'black' : 'grey.75'}
        bgColor={awaitingAnswer ? 'brand.500' : '#F5F5F50D'}
        fontWeight={awaitingAnswer ? 'bold' : 'normal'}
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
        {awaitingAnswer ? 'Sign' : isSmall ? 'Details' : 'View Details'}
      </Button>
    </HStack>
  );
};

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

export { Actions, ActionsMobile };
