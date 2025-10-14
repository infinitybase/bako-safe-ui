import { Accordion, CardRootProps, VStack } from 'bako-ui';
import { memo, ReactNode, useMemo } from 'react';

import { TransactionState } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TransactionCard } from '../..';
import { useDetailsDialog } from '../../hooks/details';
import { useVerifyTransactionInformations } from '../../hooks/details/useVerifyTransactionInformations';
import { TransactionWithVault } from '../../services/types';
import { DetailsDialog } from './DetailsDialog';

interface TransactionCardContainerProps extends CardRootProps {
  status: TransactionState;
  details: ReactNode;
  transaction: TransactionWithVault;
  isSigner: boolean;
  isInTheVaultPage?: boolean;
  callBack?: () => void;
}

const Container = memo(
  ({
    status,
    details,
    transaction,
    isSigner,
    isInTheVaultPage,
    callBack,
    ...rest
  }: TransactionCardContainerProps) => {
    const { isSigned, isCompleted, isDeclined, isReproved, isCanceled } =
      status;

    const {
      screenSizes: { isMobile },
    } = useWorkspaceContext();

    const missingSignature = useMemo(
      () =>
        !isSigned && !isCanceled && !isCompleted && !isDeclined && !isReproved,
      [isSigned, isCanceled, isCompleted, isDeclined, isReproved],
    );

    const {
      isDeposit,
      isContract,
      isFuelFriday,
      isMint,
      showAmountInformations,
    } = useVerifyTransactionInformations(transaction);

    const { isOpen, onOpen, onOpenChange } = useDetailsDialog();

    return (
      <>
        {transaction && isOpen && (
          <DetailsDialog
            open={isOpen}
            onOpenChange={onOpenChange}
            transaction={transaction}
            status={status}
            isSigner={isSigner}
            isInTheVaultPage={isInTheVaultPage}
            callBack={callBack}
            isContract={isContract}
          />
        )}

        <Accordion.Item
          pl={0}
          pr={{ base: 2, sm: 4, md: isInTheVaultPage ? 4 : 0, lg: 4 }}
          py={0}
          w="full"
          backdropFilter="blur(16px)"
          borderColor={
            missingSignature ? 'warning.500' : 'gradients.transaction-border'
          }
          bg="gradients.transaction-card"
          boxShadow="0px 8px 6px 0px #00000026"
          maxW="full"
          value={transaction.id}
          {...rest}
          display="flex"
        >
          <TransactionCard.Icon transaction={transaction} />
          <VStack
            justifyContent="center"
            gap={0}
            w="full"
            maxW={{ base: 890, lg: 'unset' }}
          >
            <TransactionCard.Header
              isMobile={isMobile}
              onOpenDialog={onOpen}
              status={status}
              transaction={transaction}
              isDeposit={isDeposit}
              isFuelFriday={isFuelFriday}
              isMint={isMint}
              isSigner={isSigner}
              showAmountInformations={showAmountInformations}
            />

            <Accordion.ItemContent px={{ base: 2, sm: 4 }} w="full">
              <Accordion.ItemBody>{details}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </VStack>
        </Accordion.Item>
      </>
    );
  },
);

Container.displayName = 'TransactionCardContainer';

export { Container };
