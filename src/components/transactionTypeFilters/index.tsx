import { Button, HStack, StackProps } from '@chakra-ui/react';
import { TransactionType } from 'bakosafe';

import { shakeAnimationY } from '@/modules';

import { DownLeftArrow, UpRightArrow } from '../icons';

interface ITransactionTypeFiltersProps extends StackProps {
  incomingAction: () => void;
  outgoingAction: () => void;
  currentFilter?: TransactionType;
  buttonsFullWidth?: boolean;
}

const TransactionTypeFilters = ({
  incomingAction,
  outgoingAction,
  currentFilter,
  buttonsFullWidth,
  ...rest
}: ITransactionTypeFiltersProps) => {
  const isDeposit = currentFilter === TransactionType.DEPOSIT;
  const isTransfer = currentFilter === TransactionType.TRANSACTION_SCRIPT;

  return (
    <HStack
      w={{ base: 'full', sm: buttonsFullWidth ? 'full' : 'unset' }}
      {...rest}
    >
      <Button
        color="grey.75"
        onClick={incomingAction}
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        css={`
          &:hover .btn-icon-1 {
            animation: ${shakeAnimationY} 0.5s ease-in-out;
          }
        `}
        w={{ base: 'full', sm: buttonsFullWidth ? 'full' : 'unset' }}
        // variant="txFilterType"
      >
        <DownLeftArrow
          color={isDeposit ? 'success.700' : 'grey.75'}
          fontSize="lg"
          className="btn-icon-1"
        />
        Incoming
      </Button>
      <Button
        color="grey.75"
        onClick={outgoingAction}
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        css={`
          &:hover .btn-icon-2 {
            animation: ${shakeAnimationY} 0.5s ease-in-out;
          }
        `}
        w={{ base: 'full', sm: buttonsFullWidth ? 'full' : 'unset' }}
        // variant="txFilterType"
      >
        <UpRightArrow
          color={isTransfer ? 'warning.550' : 'grey.75'}
          fontSize="lg"
          className="btn-icon-2"
        />
        Outgoing
      </Button>
    </HStack>
  );
};

export { TransactionTypeFilters };
