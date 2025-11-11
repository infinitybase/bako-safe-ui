import { Box } from 'bako-ui';
import { useState } from 'react';

import { Dialog } from '@/components/dialog';
import { useEvm } from '@/modules/auth/hooks';
import { useSocial } from '@/modules/auth/hooks/useSocial';
import { useMyWallet } from '@/modules/core/hooks/fuel';
import CreateTxMenuButton, {
  ECreateTransactionMethods,
} from '@/modules/transactions/components/dialog/create/createTxMenuButton';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { DappTransactionSuccess } from '../components/transaction/success';
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
    startTime,
    validAt,
    tabs,
    send: {
      isSending,
      sendTransaction,
      sendTransactionAndSign,
      cancelSendTransaction,
    },
    sign: { isSigning, signTransaction, cancelSignTransaction },
  } = useTransactionSocket();

  const {
    authDetails: {
      userInfos: { type, webauthn },
    },
  } = useWorkspaceContext();
  const { data: wallet } = useMyWallet();
  const { isConnected: isEvmConnected } = useEvm();
  const { wallet: socialWallet } = useSocial();

  const currentView = tabs.tab;

  return (
    <Box>
      {currentView === 0 && (
        <Box p={0}>
          <DappTransactionWrapper
            title="Create transaction"
            startTime={startTime}
            validAt={validAt}
            vault={vault}
            pendingSignerTransactions={pendingSignerTransactions}
            summary={summary}
            primaryActionLoading={isSending}
            cancel={cancelSendTransaction}
            primaryActionButton={
              type && (wallet || webauthn || isEvmConnected || socialWallet) ? (
                <CreateTxMenuButton
                  createTxMethod={createTxMethod}
                  setCreateTxMethod={setCreateTxMethod}
                  isLoading={isSending}
                  isDisabled={isSending}
                  handleCreateTransaction={sendTransaction}
                  handleCreateAndSignTransaction={sendTransactionAndSign}
                />
              ) : (
                <Dialog.PrimaryAction
                  size="md"
                  loading={isSending}
                  onClick={sendTransaction}
                  fontSize={14}
                >
                  Create
                </Dialog.PrimaryAction>
              )
            }
          />
        </Box>
      )}

      {currentView === 1 && (
        <Box p={0}>
          <DappTransactionWrapper
            title="Sign transaction"
            startTime={startTime}
            validAt={validAt}
            vault={vault}
            pendingSignerTransactions={pendingSignerTransactions}
            summary={summary}
            primaryActionLoading={isSigning}
            cancel={cancelSignTransaction}
            primaryActionButton={
              <Dialog.PrimaryAction
                size="md"
                loading={isSigning}
                onClick={() => signTransaction(undefined, vault?.version)}
                fontSize={14}
              >
                Sign
              </Dialog.PrimaryAction>
            }
          />
        </Box>
      )}

      {currentView === 2 && (
        <Box p={0}>
          <DappTransactionSuccess
            title="Transaction created!"
            description="Your transaction is pending to be signed. Sign at Bako Safe."
          />
        </Box>
      )}

      {currentView === 3 && (
        <Box p={0}>
          <DappTransactionSuccess
            title="Transaction created and signed!"
            description="Your transaction is pending to be signed by others. You can check the transaction status at Bako Safe."
          />
        </Box>
      )}
    </Box>
  );
};

export { TransactionConfirm };
