import {
  Badge,
  Button,
  HStack,
  Icon,
  Spacer,
  Text,
  useAccordionItemState,
} from '@chakra-ui/react';
import { ITransaction } from 'bsafe';
import React from 'react';
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from 'react-icons/io';

import { ErrorIcon, SuccessIcon } from '@/components';
import { TransactionState } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';

import { useSignTransaction } from '../../hooks/signature';

interface ActionsMobileProps {
  awaitingAnswer?: boolean | ITransaction;
}

interface TransactionActionsProps {
  status: TransactionState;
  transaction?: ITransaction;
  isSigner: boolean;
  redirectButton?: React.ReactNode;
}

const ActionsMobile = ({ awaitingAnswer }: ActionsMobileProps) => {
  return (
    <HStack w="full" justifyContent="end" spacing={1}>
      <Text color={awaitingAnswer ? 'brand.400' : 'white'} fontSize="xs">
        {awaitingAnswer ? 'Sign' : 'View Details'}
      </Text>
      <Icon
        as={IoIosArrowForward}
        fontSize="md"
        color={awaitingAnswer ? 'brand.400' : 'grey.200'}
        cursor="pointer"
      />
    </HStack>
  );
};

const Actions = ({
  transaction,
  status,
  isSigner,
  redirectButton,
}: TransactionActionsProps) => {
  const { isMobile } = useScreenSize();
  const { isOpen } = useAccordionItemState();

  const { isSigned, isDeclined, isCompleted, isReproved } = status;
  const { confirmTransaction, declineTransaction, isLoading, isSuccess } =
    useSignTransaction({ transaction: transaction! });

  const awaitingAnswer =
    !isSigned && !isDeclined && !isCompleted && !isReproved && transaction;
  const notAnswered = !isSigned && !isDeclined && (isCompleted || isReproved);

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

      {notAnswered && (
        <Badge h={6} variant="info">
          {`You didn't sign`}
        </Badge>
      )}

      {awaitingAnswer && isSigner ? (
        <HStack
          minW={140}
          pointerEvents={
            (redirectButton && isLoading) || (redirectButton && isSuccess)
              ? 'none'
              : 'unset'
          }
          opacity={
            (redirectButton && isLoading) || (redirectButton && isSuccess)
              ? '0.3'
              : 'unset'
          }
          onClick={(e) => {
            if (redirectButton) {
              e.stopPropagation();
              e.preventDefault();
              const clickedElement = e.target as HTMLElement;
              if (clickedElement.innerText.trim() === 'Sign') {
                confirmTransaction();
              }
            }
          }}
        >
          {redirectButton ? (
            redirectButton
          ) : (
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
                confirmTransaction();
              }}
            >
              Sign
            </Button>
          )}
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
