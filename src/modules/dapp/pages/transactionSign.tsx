import { Dialog } from '@/components';

import { DappTransactionWrapper } from '../components/transaction/wrapper';
import { useTransactionSocket } from '../hooks';

const TransactionSign = () => {
  const {
    validAt,
    vault,
    pendingSignerTransactions,
    summary,
    sign: { handler, cancel, isLoading },
  } = useTransactionSocket();

  const SignTransactionButton = () => (
    <Dialog.PrimaryAction
      size="md"
      isLoading={isLoading}
      onClick={handler}
      fontWeight={700}
      fontSize={14}
    >
      Sign
    </Dialog.PrimaryAction>
  );

  return (
    <DappTransactionWrapper
      title="Sign transaction"
      validAt={validAt}
      vault={vault}
      pendingSignerTransactions={pendingSignerTransactions}
      summary={summary}
      primaryActionButton={<SignTransactionButton />}
      primaryActionLoading={isLoading}
      cancel={cancel}
    />
  );
};

export { TransactionSign };
