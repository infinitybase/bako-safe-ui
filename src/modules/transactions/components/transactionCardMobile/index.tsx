import {
  Card,
  CardProps,
  Divider,
  Flex,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import { useDetailsDialog } from '../../hooks/details';
import { useVerifyTransactionInformations } from '../../hooks/details/useVerifyTransactionInformations';
import { TransactionWithVault } from '../../services/types';
import { getTransactionIconComponent, transactionStatus } from '../../utils';
import { TransactionCard } from '../TransactionCard';
import { DetailsDialog } from '../TransactionCard/DetailsDialog';

interface TransactionCardMobileProps extends CardProps {
  transaction: TransactionWithVault;
  account: string;
  isSigner: boolean;
  callBack?: () => void;
}

const TransactionCardMobile = (props: TransactionCardMobileProps) => {
  const { transaction, account, isSigner, ...rest } = props;

  const {
    isFromConnector,
    isDeploy,
    isDeposit,
    isContract,
    isFuelFriday,
    isLiquidStake,
    isBridge,
    isFromCLI,
    showAmountInformations,
    isMint,
  } = useVerifyTransactionInformations(transaction);

  const IconComponent = useMemo(
    () =>
      getTransactionIconComponent({
        isDeploy,
        isFromConnector,
        isDeposit,
        isLiquidStake,
        isBridge,
        isFromCLI,
      }),
    [isDeploy, isFromConnector, isDeposit, isFromCLI, isLiquidStake, isBridge],
  );

  const status = useMemo(
    () =>
      transactionStatus({
        ...transaction,
        account,
      }),
    [transaction, account],
  );
  const {
    isSigned,
    isCompleted,
    isDeclined,
    isReproved,
    isCanceled,
    isPendingProvider,
    isError,
  } = status;

  const missingSignature =
    !isSigned && !isCompleted && !isDeclined && !isReproved && !isCanceled;

  const awaitingAnswer =
    !isSigned &&
    !isDeclined &&
    !isCompleted &&
    !isReproved &&
    transaction &&
    !isCanceled &&
    !isPendingProvider &&
    !isError;

  const { isOpen, onOpen, onClose } = useDetailsDialog();

  return (
    <>
      <DetailsDialog
        isOpen={isOpen}
        onClose={onClose}
        transaction={transaction}
        status={status}
        isSigner={isSigner}
        callBack={props.callBack}
        isContract={isContract}
      />

      <Card
        borderColor={
          missingSignature ? 'warning.500' : 'gradients.transaction-border'
        }
        borderWidth={1}
        onClick={onOpen}
        gap={2}
        pr={4}
        backdropFilter="blur(16px)"
        bg="gradients.transaction-card"
        boxShadow="0px 8px 6px 0px #00000026"
        {...rest}
        variant={isFuelFriday ? 'green-gradient' : 'default'}
      >
        <HStack>
          <Flex
            alignItems="center"
            justifyContent="center"
            bgColor="grey.925"
            w="32px"
            borderRadius="5px 0 0 5px"
            minH="140px"
          >
            <Icon
              as={IconComponent}
              fontSize={isDeploy || isFromConnector ? 'inherit' : '12px'}
              color={'grey.425'}
            />
          </Flex>
          <VStack w="full">
            <HStack justifyContent="space-between" w="full">
              {transaction.predicate && (
                <TransactionCard.BasicInfos
                  vault={transaction.predicate}
                  transactionName={
                    isFuelFriday ? 'Fuel Friday' : transaction.name
                  }
                />
              )}

              <TransactionCard.Status
                transaction={transaction}
                status={status}
                showDescription={false}
              />
            </HStack>

            <Divider borderColor="grey.950" />

            <HStack justifyContent="space-between" w="full">
              <TransactionCard.Amount
                transaction={transaction}
                showAmount={!showAmountInformations || isDeposit || isMint}
              />

              <TransactionCard.ActionsMobile
                isPossibleToSign={awaitingAnswer}
              />
            </HStack>
          </VStack>
        </HStack>
      </Card>
    </>
  );
};

export { TransactionCardMobile };
