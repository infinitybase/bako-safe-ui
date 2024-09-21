import { Dialog, SquarePlusIcon } from '@/components';

import { DappTransactionWrapper } from '../components/transaction/wrapper';
import { useTransactionSocket } from '../hooks';

const TransactionSign = () => {
  const {
    cancelTransaction,
    vault,
    pendingSignerTransactions,
    summary,
    isLoading,
    send,
  } = useTransactionSocket();

  const SignTransactionButton = () => (
    <Dialog.PrimaryAction
      size="md"
      isLoading={isLoading}
      leftIcon={<SquarePlusIcon fontSize="lg" />}
      onClick={send}
      fontWeight={700}
      fontSize={14}
    >
      Sign
    </Dialog.PrimaryAction>
  );

  return (
    <DappTransactionWrapper
      title="Sign transaction"
      actionLoading={isLoading}
      vault={vault}
      pendingSignerTransactions={pendingSignerTransactions}
      summary={summary}
      cancelTransaction={cancelTransaction}
      actionButton={<SignTransactionButton />}
    />
  );
};

export { TransactionSign };
