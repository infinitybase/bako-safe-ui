import type { TransactionWithVault } from '@bako-safe/services';
import {
  Card,
  ContractIcon,
  DeployIcon,
  DownLeftArrowGreen,
  UpRightArrowYellow,
} from '@bako-safe/ui/components';
import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  type CardProps,
  Flex,
  Grid,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TransactionCard, transactionStatus } from '../..';
import { useDetailsDialog } from '../../hooks/details';
import { useVerifyTransactionInformations } from '../../hooks/details/useVerifyTransactionInformations';
import type { TransactionState } from '../../types';
import { DetailsDialog } from './DetailsDialog';

interface TransactionCardContainerProps extends CardProps {
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
  transaction,
  account,
  isSigner,
  isInTheVaultPage,
  callBack,
  ...rest
}: TransactionCardContainerProps) => {
  const { isSigned, isCompleted, isDeclined, isReproved } = status;

  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const missingSignature =
    !isSigned && !isCompleted && !isDeclined && !isReproved;

  const {
    isFromConnector,
    isDeploy,
    isDeposit,
    isContract,
    showAmountInformations,
  } = useVerifyTransactionInformations(transaction);

  const detailsDialog = useDetailsDialog();

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
          isContract={isContract}
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
      >
        <Flex
          alignItems="flex-start"
          justifyContent="center"
          bgColor="grey.925"
          minW="32px"
          p={0}
          borderRadius="10px 0 0 10px"
          h="auto"
        >
          <Icon
            as={
              isDeploy
                ? DeployIcon
                : isFromConnector
                  ? ContractIcon
                  : isDeposit
                    ? DownLeftArrowGreen
                    : UpRightArrowYellow
            }
            mt={8}
            fontSize={isDeploy || isFromConnector ? 'inherit' : '12px'}
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
                  h={'59px'}
                  justifyContent={'center'}
                  vault={transaction.predicate}
                  transactionName={transaction.name}
                />
              )}

              <TransactionCard.Amount
                transaction={transaction}
                showAmount={!showAmountInformations}
              />
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
