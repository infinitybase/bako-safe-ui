import type { TransactionWithVault } from '@bako-safe/services';
import {
  ContractIcon,
  DeployIcon,
  DownLeftArrowGreen,
  UpRightArrowYellow,
} from '@bako-safe/ui';
import {
  Card,
  type CardProps,
  Divider,
  Flex,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';

import { useDetailsDialog } from '../../hooks/details';
import { useVerifyTransactionInformations } from '../../hooks/details/useVerifyTransactionInformations';
import { transactionStatus } from '../../utils';
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
    showAmountInformations,
  } = useVerifyTransactionInformations(transaction);

  const status = transactionStatus({
    ...transaction,
    account,
  });
  const { isSigned, isCompleted, isDeclined, isReproved } = status;

  const missingSignature =
    !isSigned && !isCompleted && !isDeclined && !isReproved;

  const awaitingAnswer =
    !isSigned && !isDeclined && !isCompleted && !isReproved && transaction;

  const { isOpen, onOpen, onClose } = useDetailsDialog();

  return (
    <>
      <DetailsDialog
        isOpen={isOpen}
        onClose={onClose}
        transaction={transaction}
        account={account}
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
              as={
                isDeploy
                  ? DeployIcon
                  : isFromConnector
                    ? ContractIcon
                    : isDeposit
                      ? DownLeftArrowGreen
                      : UpRightArrowYellow
              }
              fontSize={isDeploy || isFromConnector ? 'inherit' : '12px'}
            />
          </Flex>
          <VStack w="full">
            <HStack justifyContent="space-between" w="full">
              {transaction.predicate && (
                <TransactionCard.BasicInfos
                  vault={transaction.predicate}
                  transactionName={transaction.name}
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
                showAmount={!showAmountInformations}
              />

              <TransactionCard.ActionsMobile awaitingAnswer={awaitingAnswer} />
            </HStack>
          </VStack>
        </HStack>
      </Card>
    </>
  );
};

export { TransactionCardMobile };
