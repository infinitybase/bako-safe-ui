import { AccordionButton, Box, Grid, HStack } from '@chakra-ui/react';
import { memo, useRef } from 'react';

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
    return (
      <HStack
        as={isMobile ? Box : AccordionButton}
        onClick={onOpenDialog}
        w="full"
        _hover={{ bgColor: 'transparent' }}
        px={{ base: 2, sm: 4 }}
        py={2}
      >
        <Grid
          w="full"
          gap={{ base: 2, sm: 4 }}
          templateColumns="repeat(4, 1fr)"
        >
          {transaction.predicate && (
            <TransactionCard.BasicInfos
              h={'59px'}
              justifyContent={'center'}
              vault={transaction.predicate}
              transactionName={
                isFuelFriday
                  ? 'Fuel Friday'
                  : (transaction.name ??
                    transaction.type.slice(0, 1).toUpperCase() +
                      transaction.type.slice(1).toLowerCase())
              }
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
      </HStack>
    );
  },
);

Header.displayName = 'Transaction Card Header';
