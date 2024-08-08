import {
  Badge,
  Button,
  HStack,
  Icon,
  Spacer,
  useAccordionItemState,
} from '@chakra-ui/react';
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from 'react-icons/io';

import { ErrorIcon, SuccessIcon } from '@/components';
import { TransactionState } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';

import { ITransactionWithType } from '../../services';
import { TransactionStatus, TransactionType } from 'bakosafe';
import { useTransactionSend } from '../../providers';
import { useEffect } from 'react';

interface ActionsMobileProps {
  awaitingAnswer?: boolean | ITransactionWithType;
}

interface TransactionActionsProps {
  status: TransactionState;
  transaction?: ITransactionWithType;
  isInTheVaultPage?: boolean;
  isSigner: boolean;
  callBack?: () => void;
}

const ActionsMobile = ({ awaitingAnswer }: ActionsMobileProps) => {
  const { isSmall, isExtraSmall } = useScreenSize();
  return (
    <HStack w="full" justifyContent="end" spacing={1}>
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
}: TransactionActionsProps) => {
  const { isMobile } = useScreenSize();
  const { isOpen } = useAccordionItemState();
  const {
    signTransaction: {
      confirmTransaction,
      declineTransaction,
      isTransactionSuccess,
      isTransactionLoading,
      setCurrentTransaction,
    },
  } = useTransactionSend();

  useEffect(() => {
    if (
      transaction &&
      transaction?.status === TransactionStatus.AWAIT_REQUIREMENTS
    ) {
      setCurrentTransaction(transaction);
    } else if (
      isTransactionSuccess &&
      transaction?.status === TransactionStatus.PROCESS_ON_CHAIN
    ) {
      setCurrentTransaction(transaction);
    }
  }, [transaction]);

  const { isSigned, isDeclined, isCompleted, isReproved } = status;

  const awaitingAnswer =
    !isSigned && !isDeclined && !isCompleted && !isReproved && transaction;
  const notAnswered = !isSigned && !isDeclined && (isCompleted || isReproved);

  const isDeposit = transaction?.type === TransactionType.DEPOSIT;

  if (isMobile) {
    return <ActionsMobile awaitingAnswer={awaitingAnswer} />;
  }

  return (
    <HStack minW={140} justifySelf="end">
      {isSigned && (
        <Badge h={6} variant="success">
          You signed
          <Icon as={SuccessIcon} />
        </Badge>
      )}

      {isDeclined && (
        <Badge h={6} variant="error">
          You declined
          <Icon as={ErrorIcon} />
        </Badge>
      )}

      {!isDeposit && notAnswered && (
        <Badge h={6} variant="info">
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
            isLoading={isTransactionLoading}
            isDisabled={isTransactionSuccess}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              confirmTransaction(callBack);
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
              declineTransaction(transaction.id);
            }}
            isLoading={isTransactionLoading}
            isDisabled={isTransactionSuccess}
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
