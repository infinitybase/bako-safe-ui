import { Accordion, Box, Grid } from 'bako-ui';
import { memo } from 'react';

import { TransactionState } from '@/modules/core';

import { TransactionWithVault } from '../../services';
import { TransactionCard } from '../TransactionCard';

interface TransactionCardHeaderProps {
  onOpenDialog: () => void;
  transaction: TransactionWithVault;
  status: TransactionState;
  isMobile: boolean;
  isFuelFriday?: boolean;
  showAmountInformations: boolean;
  isDeposit: boolean;
  isMint: boolean;
  isSigner: boolean;
}

export const Header = memo(
  ({
    onOpenDialog,
    transaction,
    status,
    isMobile,
    isDeposit,
    isFuelFriday,
    showAmountInformations,
    isMint,
    isSigner,
  }: TransactionCardHeaderProps) => {
    const Root = isMobile ? Box : Accordion.ItemTrigger;
    return (
      <Root
        onClick={onOpenDialog}
        w="full"
        _hover={{ bgColor: 'transparent' }}
        px={{ base: 2, sm: 4 }}
        py={2}
        aria-label="Transaction Card Header"
      >
        <Grid
          w="full"
          gap={{ base: 2, sm: 4 }}
          templateColumns="repeat(4, 1fr)"
        >
          {transaction.predicate && (
            <TransactionCard.BasicInfos
              h="45px"
              justifyContent={'center'}
              vault={transaction.predicate}
              transactionName={isFuelFriday ? 'Fuel Friday' : transaction.name}
            />
          )}

          <TransactionCard.Amount
            transaction={transaction}
            showAmount={!showAmountInformations || isDeposit || isMint}
          />
          <TransactionCard.Status transaction={transaction} status={status} />
          <TransactionCard.Actions
            transaction={transaction}
            isSigner={isSigner}
            status={status}
          />
        </Grid>
      </Root>
    );
  },
);

Header.displayName = 'Transaction Card Header';
