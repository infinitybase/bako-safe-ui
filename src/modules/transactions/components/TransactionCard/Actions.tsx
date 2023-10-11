import { Badge, Button, HStack, Icon, Spacer } from '@chakra-ui/react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { ErrorIcon, SuccessIcon } from '@/components';
import { Transaction, TransactionState } from '@/modules/core';

import { useSignTransaction } from '../../hooks/signature';

interface TransactionActionsProps {
  status: TransactionState;
  isExpanded?: boolean;
  transaction?: Transaction;
  collapse: () => void;
}

const Actions = ({
  isExpanded,
  transaction,
  status,
  collapse,
}: TransactionActionsProps) => {
  const { isSigned, isDeclined, isCompleted, isReproved, isPending } = status;
  const { confirmTransaction, declineTransaction, isLoading } =
    useSignTransaction();

  const awaitingAnswer =
    !isSigned && !isDeclined && !isCompleted && !isReproved && transaction;
  const userDidntAnswer =
    !isSigned && !isDeclined && (isCompleted || isReproved);

  console.log(`>>>>>`, transaction?.name, {
    isSigned,
    isDeclined,
    isCompleted,
    isReproved,
    isPending,
  });

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
      {userDidntAnswer && (
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
            isDisabled={isLoading}
            onClick={() =>
              confirmTransaction({
                txId: transaction.hash,
                transactionID: transaction.id,
                predicateID: transaction.predicateID,
              })
            }
          >
            Sign
          </Button>
          <Button
            h={9}
            px={3}
            variant="secondary"
            onClick={() => declineTransaction(transaction.id)}
          >
            Decline
          </Button>
        </HStack>
      )}

      <Icon
        as={isExpanded ? IoIosArrowUp : IoIosArrowDown}
        fontSize="xl"
        color="grey.200"
        cursor="pointer"
        onClick={collapse}
        ml={-5}
      />
    </>
  );
};

export { Actions };
