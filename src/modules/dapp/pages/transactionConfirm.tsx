import { Box, Button } from 'bako-ui';
import { TransactionRequest, TransactionSummary } from 'fuels';
import { useState } from 'react';

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
import { useSimplifiedTransaction } from '../hooks/useSimplifiedTransaction';

const isTransactionSummary = (obj: unknown): obj is TransactionSummary => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'fee' in obj &&
    'operations' in obj
  );
};

const TransactionConfirm = () => {
  const [createTxMethod, setCreateTxMethod] =
    useState<ECreateTransactionMethods>(
      ECreateTransactionMethods.CREATE_AND_SIGN,
    );

  const {
    vault,
    pendingSignerTransactions,
    summary,
    tx,
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

  const { transaction } = useSimplifiedTransaction({
    tx: isTransactionSummary(summary.transactionSummary)
      ? summary.transactionSummary
      : undefined,
    txRequest: tx as TransactionRequest | undefined,
    txAccount: vault.address,
  });

  const currentView = tabs.tab;

  return (
    <Box>
      {currentView === 0 && (
        <Box p={0}>
          <DappTransactionWrapper
            title="Review transaction"
            startTime={startTime}
            validAt={validAt}
            vault={vault}
            pendingSignerTransactions={pendingSignerTransactions}
            summary={summary}
            primaryActionLoading={isSending}
            cancel={cancelSendTransaction}
            transaction={transaction}
            primaryActionButton={
              type && (wallet || webauthn || isEvmConnected || socialWallet) ? (
                <CreateTxMenuButton
                  createTxMethod={createTxMethod}
                  setCreateTxMethod={setCreateTxMethod}
                  isLoading={isSending}
                  isDisabled={isSending || pendingSignerTransactions}
                  handleCreateTransaction={sendTransaction}
                  handleCreateAndSignTransaction={sendTransactionAndSign}
                />
              ) : (
                <Button
                  flex={1}
                  colorPalette="primary"
                  fontWeight={600}
                  fontSize={14}
                  loading={isSending}
                  disabled={isSending || pendingSignerTransactions}
                  onClick={sendTransaction}
                >
                  Create
                </Button>
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
            transaction={transaction}
            primaryActionButton={
              <Button
                flex={1}
                colorPalette="primary"
                fontWeight={600}
                fontSize={14}
                loading={isSigning}
                disabled={isSending || pendingSignerTransactions}
                onClick={() => signTransaction(undefined, vault?.version)}
              >
                Sign
              </Button>
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
