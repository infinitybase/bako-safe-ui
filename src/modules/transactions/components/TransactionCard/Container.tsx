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
  isInTheVaultPage?: boolean;
  callBack?: () => void;
}

const Container = ({
  status,
  details,
  children,
  transaction,
  account,
  isSigner,
  isInTheVaultPage,
  callBack,
  ...rest
}: TransactionCardContainerProps) => {
  const { isSigned, isCompleted, isDeclined, isReproved } = status;

  const missingSignature =
    !isSigned && !isCompleted && !isDeclined && !isReproved;

  const { isMobile, vaultRequiredSizeToColumnLayout } = useScreenSize();
  const detailsDialog = useDetailsDialog();

  const childrensQuantity = React.Children.toArray(children).length;

  const isInTheVaultWithSideBar =
    isInTheVaultPage && !vaultRequiredSizeToColumnLayout;
  const isInTheVaultWithoutSideBar =
    isInTheVaultPage && vaultRequiredSizeToColumnLayout;

  const gridTemplateColumns = isMobile
    ? 'repeat(2, 1fr)'
    : isInTheVaultWithSideBar
      ? 'repeat(5, 1fr)'
      : isInTheVaultWithoutSideBar && childrensQuantity < 6
        ? 'repeat(4, 1fr)'
        : isInTheVaultWithoutSideBar && childrensQuantity >= 6
          ? 'repeat(5,1fr)'
          : 'repeat(6,1fr)';

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
          isInTheVaultPage={isInTheVaultPage}
          callBack={callBack}
        />
      )}

      <Card
        py={{ base: 1, sm: 4 }}
        px={{ base: 2, sm: 4, md: isInTheVaultPage ? 4 : 0, lg: 4 }}
        w="full"
        as={AccordionItem}
        backdropFilter="blur(8px)"
        borderColor={
          missingSignature ? 'warning.500' : 'gradients.transaction-border'
        }
        bg="gradients.transaction-card"
        boxShadow="0px 8px 6px 0px #00000026"
        maxW="full"
        {...rest}
      >
        <VStack
          justifyContent="center"
          gap={0}
          w="full"
          maxW={{ base: 890, lg: 'unset' }}
        >
          <HStack
            as={isMobile ? Box : AccordionButton}
            onClick={detailsDialog.onOpen}
            w="full"
            _hover={{ bgColor: 'transparent' }}
            px={{ base: 2, sm: 4 }}
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
