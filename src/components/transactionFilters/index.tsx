import { Button, HStack, Icon, StackProps, Text } from 'bako-ui';
import { TransactionType } from 'bakosafe';

import { StatusFilter } from '@/modules';

import {
  ChevronRightIcon,
  DownLeftArrow,
  UpRightArrow,
  Warning2Icon,
} from '../icons';

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
          px={3}
        >
          <Text display={{ sm: 'inline', base: 'none' }}>Pending</Text>
          <Icon
            boxSize={4}
            as={Warning2Icon}
            color="primary.main"
            display={{ sm: 'none', base: 'inline' }}
          />
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
        px={3}
        order={1}
      >
        <Icon
          boxSize={4}
          as={DownLeftArrow}
          display={{ sm: 'none', base: 'inline' }}
        />
        <Text display={{ base: 'none', sm: 'inline' }}>Incoming</Text>
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
        px={3}
        variant="subtle"
      >
        <Icon
          boxSize={4}
          as={UpRightArrow}
          display={{ sm: 'none', base: 'inline' }}
        />
        <Text display={{ base: 'none', sm: 'inline' }}>Outgoing</Text>
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
        px={3}
        order={inverse ? 0 : 2}
      >
        <Icon
          boxSize={4}
          as={ChevronRightIcon}
          display={{ sm: 'none', base: 'inline' }}
        />
        <Text display={{ base: 'none', sm: 'inline' }}>All</Text>
      </Button>
    </HStack>
  );
};

export { TransactionFilters };
