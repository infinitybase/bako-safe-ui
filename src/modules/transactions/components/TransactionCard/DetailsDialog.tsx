import { Button, Divider, HStack, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';

import { Dialog, DialogModalProps } from '@/components';
import {
  TransactionCard,
  TransactionState,
  transactionStatus,
} from '@/modules';
import { limitCharacters } from '@/utils';

import { useSignTransaction } from '../../hooks/signature';
import { TransactionWithVault } from '../../services/types';
interface DetailsDialogProps extends Omit<DialogModalProps, 'children'> {
  transaction: TransactionWithVault;
  account: string;
  status: TransactionState;
  isInTheVaultPage?: boolean;
  isSigner: boolean;
}

const DetailsDialog = ({ ...props }: DetailsDialogProps) => {
  const { onClose, isOpen, transaction, account, status, isSigner } = props;

  const { confirmTransaction, declineTransaction, isLoading, isSuccess } =
    useSignTransaction({ transaction: transaction! });

  const { isSigned, isCompleted, isDeclined, isReproved } = status;

  const awaitingAnswer =
    !isSigned && !isDeclined && !isCompleted && !isReproved && transaction;

  const showSignActions = awaitingAnswer && isSigner;

  return (
    <Dialog.Modal onClose={onClose} isOpen={isOpen}>
      <Dialog.Header
        position="relative"
        mb={0}
        top={{ base: -5, sm: -7 }}
        w="full"
        maxW={{ base: 480, xs: 'unset' }}
        title="Transaction Details"
      />
      <Dialog.Body mt={-4}>
        <VStack spacing={{ base: 3, xs: 5 }}>
          <VStack w="full" spacing={3}>
            <HStack w="full">
              <TransactionCard.Amount
                assets={
                  transaction?.assets.map((asset) => ({
                    amount: asset.amount,
                    assetId: asset.assetId,
                    to: asset.to,
                  })) ?? []
                }
              />

              <TransactionCard.CreationDate>
                {format(new Date(transaction?.createdAt), 'EEE, dd MMM')}
              </TransactionCard.CreationDate>
            </HStack>

            <HStack w="full">
              <TransactionCard.Name>
                {limitCharacters(transaction?.name ?? '', 20)}
              </TransactionCard.Name>

              <TransactionCard.Status
                transaction={transaction}
                status={transactionStatus({
                  ...transaction,
                  account,
                })}
              />
            </HStack>
          </VStack>

          <Divider />

          <TransactionCard.Details transaction={transaction} />
        </VStack>
      </Dialog.Body>

      <Dialog.Actions mt="auto">
        {showSignActions ? (
          <>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                declineTransaction(transaction.id);
              }}
              isLoading={isLoading}
              isDisabled={isSuccess}
            >
              Decline
            </Button>
            <Button
              variant="primary"
              w="full"
              isLoading={isLoading}
              isDisabled={isSuccess}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                confirmTransaction();
              }}
            >
              Sign
            </Button>
          </>
        ) : (
          <Button variant="secondary" w="full" onClick={onClose}>
            Back
          </Button>
        )}
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { DetailsDialog };
