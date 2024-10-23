import { Button } from '@chakra-ui/react';
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
    transactionSuccess,
    send: {
      isLoading,
      cancel,
      handlers: { sendTransaction, sendTransactionAndSign },
    },
    handleRedirectToBakoSafe,
  } = useTransactionSocket();

  const CreateTransactionButton = () => (
    <CreateTxMenuButton
      createTxMethod={createTxMethod}
      setCreateTxMethod={setCreateTxMethod}
      isLoading={isLoading}
      isDisabled={isLoading}
      handleCreateTransaction={sendTransaction}
      handleCreateAndSignTransaction={sendTransactionAndSign}
    />
  );

  const RedirectToBakoSafeButton = () => (
    <Button
      variant="outline"
      onClick={() => handleRedirectToBakoSafe()}
      w="full"
      borderColor="grey.75"
      fontWeight={500}
      fontSize="sm"
      letterSpacing=".5px"
      color="grey.75"
      _hover={{}}
      _active={{}}
    >
      Go to Bako Safe
    </Button>
  );

  return (
    <DappTransactionWrapper
      title="Create transaction"
      validAt={validAt}
      vault={vault}
      pendingSignerTransactions={pendingSignerTransactions}
      summary={summary}
      primaryActionButton={<CreateTransactionButton />}
      redirectButton={<RedirectToBakoSafeButton />}
      primaryActionLoading={isLoading}
      cancel={cancel}
      transactionSuccess={transactionSuccess}
    />
  );
};

export { TransactionConfirm };
