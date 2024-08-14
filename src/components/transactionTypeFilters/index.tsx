import { BoxProps, Button, HStack, Icon } from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';
import { TransactionType } from 'bakosafe';

import { useScreenSize } from '@/modules';

import { DownLeftArrow, UpRightArrow } from '../icons';

const shakeAnimation = keyframes`
  0% { transform: translateY(0); }
  25% { transform: translateY(-2px); }
  50% { transform: translateY(2px); }
  75% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
`;

interface ITransactionTypeFiltersProps extends BoxProps {
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
  const { isSmall } = useScreenSize();

  const isDeposit = currentFilter === TransactionType.DEPOSIT;
  const isTransfer = currentFilter === TransactionType.TRANSACTION_SCRIPT;

  return (
    <HStack w={buttonsFullWidth ? 'full' : 'unset'} {...rest}>
      <Button
        color="grey.75"
        onClick={incomingAction}
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        css={css`
          &:hover .btn-icon-1 {
            animation: ${shakeAnimation} 0.5s ease-in-out;
          }
        `}
        rightIcon={
          <Icon
            as={DownLeftArrow}
            textColor={isDeposit ? 'success.700' : 'grey.75'}
            fontSize="lg"
            ml={isSmall ? -1 : 0}
            className="btn-icon-1"
          />
        }
        w={buttonsFullWidth ? 'full' : 'unset'}
        variant="txFilterType"
      >
        Incoming
      </Button>
      <Button
        color="grey.75"
        onClick={outgoingAction}
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        css={css`
          &:hover .btn-icon-2 {
            animation: ${shakeAnimation} 0.5s ease-in-out;
          }
        `}
        rightIcon={
          <Icon
            as={UpRightArrow}
            textColor={isTransfer ? 'warning.550' : 'grey.75'}
            fontSize="lg"
            ml={isSmall ? -1 : 0}
            className="btn-icon-2"
          />
        }
        w={buttonsFullWidth ? 'full' : 'unset'}
        variant="txFilterType"
      >
        Outgoing
      </Button>
    </HStack>
  );
};

export { TransactionTypeFilters };
