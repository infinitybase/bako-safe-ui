import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  CardProps,
  Grid,
  HStack,
  VStack,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';

import { Card } from '@/components';
import { TransactionState, useScreenSize } from '@/modules/core';

import { useDetailsDialog } from '../../hooks/details';
import { TransactionWithVault } from '../../services/types';
import { DetailsDialog } from './DetailsDialog';

interface TransactionCardContainerProps extends CardProps {
  children: ReactNode;
  status: TransactionState;
  details: ReactNode;
  transaction: TransactionWithVault;
  account: string;
  isSigner: boolean;
  callBack?: () => void;
}

const Container = ({
  status,
  details,
  children,
  transaction,
  account,
  isSigner,
  callBack,
  ...rest
}: TransactionCardContainerProps) => {
  const { isSigned, isCompleted, isDeclined, isReproved } = status;
  const missingSignature =
    !isSigned && !isCompleted && !isDeclined && !isReproved;

  const childrens = React.Children.toArray(children);

  const { isMobile } = useScreenSize();
  const detailsDialog = useDetailsDialog();

  const gridTemplateColumns = isMobile
    ? '1fr 1fr'
    : childrens.length === 7
      ? '2fr 1fr 1fr 2fr 2fr 4fr'
      : '1fr 1fr 2fr 2fr 4fr';

  return (
    <>
      {transaction && (
        <DetailsDialog
          isOpen={detailsDialog.isOpen}
          onClose={detailsDialog.onClose}
          transaction={transaction}
          account={account}
          status={status}
          isSigner={isSigner}
          callBack={callBack}
        />
      )}
      <Card
        py={{ base: 1, sm: 4 }}
        px={{ base: 2, sm: 4 }}
        w="full"
        as={AccordionItem}
        bgColor="grey.800"
        borderColor={missingSignature ? 'warning.500' : 'dark.100'}
        minW={{ base: 0, sm: 'min-content' }}
        maxW="full"
        {...rest}
      >
        <VStack justifyContent="center" gap={0} w="full">
          <HStack
            as={isMobile ? Box : AccordionButton}
            onClick={detailsDialog.onOpen}
            w="full"
            _hover={{ bgColor: 'transparent' }}
            px={[2, 4]}
            py={2}
          >
            <Grid
              w="full"
              gap={{ base: 2, sm: 4 }}
              templateColumns={gridTemplateColumns}
              templateRows={isMobile ? '1fr 1fr' : undefined}
            >
              {children}
            </Grid>
          </HStack>

          <Box w="full">
            <AccordionPanel px={{ base: 2, sm: 4 }} w="full">
              {details}
            </AccordionPanel>
          </Box>
        </VStack>
      </Card>
    </>
  );
};

export { Container };
