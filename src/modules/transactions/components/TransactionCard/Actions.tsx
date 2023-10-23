import {
  Badge,
  Button,
  HStack,
  Icon,
  Spacer,
  useAccordionItemState,
} from '@chakra-ui/react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { ErrorIcon, SuccessIcon } from '@/components';
import { Transaction, TransactionState } from '@/modules/core';

import { useSignTransaction } from '../../hooks/signature';

interface TransactionActionsProps {
  status: TransactionState;
  transaction?: Transaction;
}

const Actions = ({ transaction, status }: TransactionActionsProps) => {
  const { isOpen } = useAccordionItemState();

  const { isSigned, isDeclined, isCompleted, isReproved } = status;
  const { confirmTransaction, declineTransaction, isLoading, isSuccess } =
    useSignTransaction({ transaction: transaction! });

  const awaitingAnswer =
    !isSigned && !isDeclined && !isCompleted && !isReproved && transaction;
  const notAnswered = !isSigned && !isDeclined && (isCompleted || isReproved);

  return (
    <>
      <Spacer />
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

      {notAnswered && (
        <Badge h={6} variant="info">
          {`You didn't sign`}
        </Badge>
      )}

      {awaitingAnswer && (
        <HStack>
          <Button
            h={9}
            px={3}
            variant="primary"
            size="sm"
            isLoading={isLoading}
            isDisabled={isSuccess}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              confirmTransaction({
                txId: transaction.hash,
                transactionID: transaction.id,
                predicateID: transaction.predicateID,
              });
            }}
          >
            Sign
          </Button>
          <Button
            h={9}
            px={3}
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              declineTransaction(transaction.id);
            }}
            isLoading={isLoading}
            isDisabled={isSuccess}
          >
            Decline
          </Button>
        </HStack>
      )}

      <Icon
        as={isOpen ? IoIosArrowUp : IoIosArrowDown}
        fontSize="xl"
        color="grey.200"
        cursor="pointer"
        ml={-5}
      />
    </>
  );
};

export { Actions };
