import { Dialog, SquarePlusIcon } from '@/components';

import { DappTransactionWrapper } from '../components/transaction/wrapper';
import { useTransactionSocket } from '../hooks';

const TransactionConfirm = () => {
  const {
    cancelTransaction,
    vault,
    pendingSignerTransactions,
    summary,
    isLoading,
    send,
    validAt,
  } = useTransactionSocket();

  const CreateTransactionButton = () => (
    <Dialog.PrimaryAction
      size="md"
      isLoading={isLoading}
      leftIcon={<SquarePlusIcon fontSize="lg" />}
      onClick={send}
      fontWeight={700}
      fontSize={14}
    >
      Create transaction
    </Dialog.PrimaryAction>
  );

  return (
    <DappTransactionWrapper
      title="Create transaction"
      actionLoading={isLoading}
      validAt={validAt}
      vault={vault}
      pendingSignerTransactions={pendingSignerTransactions}
      summary={summary}
      cancelTransaction={cancelTransaction}
      actionButton={<CreateTransactionButton />}
    />
  );
};

export { TransactionConfirm };
