import { Card, CardProps, Divider, HStack } from '@chakra-ui/react';
import format from 'date-fns/format';

import { useDetailsDialog } from '../../hooks/details';
import { TransactionWithVault } from '../../services';
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
      />

      <Card
        bgColor="grey.800"
        borderColor={missingSignature ? 'warning.500' : 'dark.100'}
        borderWidth="1px"
        onClick={onOpen}
        gap={2}
        p={4}
        {...rest}
      >
        <HStack justifyContent="space-between">
          <TransactionCard.Name transactionName={transaction.name} />

          <TransactionCard.Status
            transaction={transaction}
            status={status}
            showDescription={false}
          />
        </HStack>

        <HStack mt={2}>
          {transaction.predicate && (
            <TransactionCard.VaultInfo vault={transaction.predicate} />
          )}

          <TransactionCard.CreationDate>
            {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
          </TransactionCard.CreationDate>
        </HStack>

        <Divider bgColor="grey.600" />

        <HStack justifyContent="space-between">
          <TransactionCard.Amount assets={transaction.resume.outputs} />

          <TransactionCard.ActionsMobile awaitingAnswer={awaitingAnswer} />
        </HStack>
      </Card>
    </>
  );
};

export { TransactionCardMobile };
