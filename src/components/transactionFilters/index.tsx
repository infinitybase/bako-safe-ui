import { Button, HStack, StackProps } from 'bako-ui';
import { TransactionType } from 'bakosafe';

import { StatusFilter } from '@/modules';

interface ITransactionFiltersProps extends StackProps {
  onIncomingFilter: () => void;
  onOutgoingFilter: () => void;
  onAllFilter: () => void;
  onPendingFilter: () => void;
  status?: StatusFilter;
  currentFilter?: TransactionType;
  isPendingSignerTransaction: boolean;
  inverse?: boolean;
}

const TransactionFilters = ({
  onIncomingFilter,
  onOutgoingFilter,
  currentFilter,
  onAllFilter,
  status,
  isPendingSignerTransaction,
  inverse = false,
  onPendingFilter,
  ...rest
}: ITransactionFiltersProps) => {
  const isDeposit = currentFilter === TransactionType.DEPOSIT;
  const isTransfer = currentFilter === TransactionType.TRANSACTION_SCRIPT;
  const isPending = status === StatusFilter.PENDING;
  const isAll = !currentFilter && !isPending;

  return (
    <HStack w="full" {...rest}>
      {isPendingSignerTransaction && (
        <Button
          bg={isPending ? 'primary.main/20' : 'primary.main/5'}
          color="primary.main"
          _hover={{
            bg: 'primary.main/20',
          }}
          order={inverse ? 2 : 0}
          onClick={onPendingFilter}
          alignSelf={{ base: 'stretch', sm: 'flex-end' }}
          variant="subtle"
        >
          Pending
        </Button>
      )}
      <Button
        bg={isDeposit ? 'bg.muted' : 'bg.panel'}
        _hover={{
          bg: 'bg.muted',
          color: 'textPrimary',
        }}
        color={isDeposit ? 'textPrimary' : 'textSecondary'}
        onClick={onIncomingFilter}
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        variant="subtle"
        order={1}
      >
        Incoming
      </Button>
      <Button
        bg={isTransfer ? 'bg.muted' : 'bg.panel'}
        _hover={{
          bg: 'bg.muted',
          color: 'textPrimary',
        }}
        color={isTransfer ? 'textPrimary' : 'textSecondary'}
        onClick={onOutgoingFilter}
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        order={1}
        variant="subtle"
      >
        Outgoing
      </Button>
      <Button
        bg={isAll ? 'bg.muted' : 'bg.panel'}
        _hover={{
          bg: 'bg.muted',
          color: 'textPrimary',
        }}
        color={isAll ? 'textPrimary' : 'textSecondary'}
        onClick={onAllFilter}
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        variant="subtle"
        order={inverse ? 0 : 2}
      >
        All
      </Button>
    </HStack>
  );
};

export { TransactionFilters };
