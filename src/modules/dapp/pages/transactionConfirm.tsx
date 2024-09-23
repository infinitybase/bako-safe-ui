import { useState } from 'react';

import CreateTxMenuButton, {
  ECreateTransactionMethods,
} from '@/modules/transactions/components/dialog/create/createTxMenuButton';

import { DappTransactionWrapper } from '../components/transaction/wrapper';
import { useTransactionSocket } from '../hooks';

const TransactionConfirm = () => {
  const [createTxMethod, setCreateTxMethod] =
    useState<ECreateTransactionMethods>(
      ECreateTransactionMethods.CREATE_AND_SIGN,
    );

  const {
    vault,
    pendingSignerTransactions,
    summary,
    validAt,
    send: { isLoading, handler, redirectHandler, cancel },
  } = useTransactionSocket();

  const CreateTransactionButton = () => (
    <CreateTxMenuButton
      createTxMethod={createTxMethod}
      setCreateTxMethod={setCreateTxMethod}
      isLoading={isLoading}
      isDisabled={isLoading}
      handleCreateTransaction={handler}
      handleCreateAndSignTransaction={redirectHandler}
    />
  );

  return (
    <DappTransactionWrapper
      title="Create transaction"
      validAt={validAt}
      vault={vault}
      pendingSignerTransactions={pendingSignerTransactions}
      summary={summary}
      primaryActionButton={<CreateTransactionButton />}
      primaryActionLoading={isLoading}
      cancel={cancel}
    />
  );
};

export { TransactionConfirm };
