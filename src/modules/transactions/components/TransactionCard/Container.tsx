import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  CardProps,
  Flex,
  Grid,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { TransactionType } from 'bakosafe';
import { ReactNode } from 'react';

import { Card, DownLeftArrow, UpRightArrow } from '@/components';
import { ContractIcon } from '@/components/icons/tx-contract';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { TransactionState, useScreenSize } from '@/modules/core';

import { TransactionCard, transactionStatus } from '../..';
import { useDetailsDialog } from '../../hooks/details';
import { TransactionWithVault } from '../../services/types';
import { DetailsDialog } from './DetailsDialog';

interface TransactionCardContainerProps extends CardProps {
  status: TransactionState;
  details: ReactNode;
  transaction: TransactionWithVault;
  account: string;
  isSigner: boolean;
  isInTheVaultPage?: boolean;
  isContract?: boolean;
  callBack?: () => void;
}

const Container = ({
  status,
  details,
  transaction,
  account,
  isSigner,
  isInTheVaultPage,
  callBack,
  isContract,
  ...rest
}: TransactionCardContainerProps) => {
  const { isSigned, isCompleted, isDeclined, isReproved } = status;

  const missingSignature =
    !isSigned && !isCompleted && !isDeclined && !isReproved;

  const { isMobile } = useScreenSize();
  const detailsDialog = useDetailsDialog();
  const isDeposit = transaction.type === TransactionType.DEPOSIT;

  const isDeploy = transaction.type === TransactionType.TRANSACTION_CREATE;
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
        pl={0}
        pr={{ base: 2, sm: 4, md: isInTheVaultPage ? 4 : 0, lg: 4 }}
        py={0}
        w="full"
        as={AccordionItem}
        backdropFilter="blur(16px)"
        borderColor={
          missingSignature ? 'warning.500' : 'gradients.transaction-border'
        }
        bg="gradients.transaction-card"
        boxShadow="0px 8px 6px 0px #00000026"
        maxW="full"
        {...rest}
        display="flex"
        minH="78px"
      >
        <Flex
          alignItems="flex-start"
          justifyContent="center"
          bgColor="grey.925"
          w="32px"
          p={0}
          borderRadius="10px 0 0 10px"
          h="auto"
        >
          <Icon
            as={
              isDeploy
                ? DeployIcon
                : isContract
                  ? ContractIcon
                  : isDeposit
                    ? DownLeftArrow
                    : UpRightArrow
            }
            mt={8}
            fontSize={isDeploy || isContract ? 'inherit' : '12px'}
          />
        </Flex>
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
              templateColumns="repeat(4, 1fr)"
            >
              {transaction.predicate && (
                <TransactionCard.BasicInfos
                  vault={transaction.predicate}
                  transactionName={transaction.name}
                />
              )}

              <TransactionCard.Amount assets={transaction.assets} />
              <TransactionCard.Status
                transaction={transaction}
                status={transactionStatus({
                  ...transaction,
                  account,
                })}
              />
              <TransactionCard.Actions
                transaction={transaction}
                isSigner={isSigner}
                status={transactionStatus({
                  ...transaction,
                  account,
                })}
              />
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
