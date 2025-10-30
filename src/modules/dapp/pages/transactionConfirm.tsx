import { TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useState } from 'react';

import { Dialog } from '@/components/dialog';
import { useMyWallet } from '@/modules/core/hooks/fuel';
import CreateTxMenuButton, {
  ECreateTransactionMethods,
} from '@/modules/transactions/components/dialog/create/createTxMenuButton';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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

  return (
    <Tabs isLazy index={tabs.tab}>
      <TabPanels>
        <TabPanel p={0}>
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
              type && (wallet || webauthn) ? (
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
                  isLoading={isSending}
                  onClick={sendTransaction}
                  fontSize={14}
                >
                  Create
                </Dialog.PrimaryAction>
              )
            }
          />
        </TabPanel>

        <TabPanel p={0}>
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
                isLoading={isSigning}
                onClick={() => signTransaction(undefined, vault?.version)}
                fontSize={14}
              >
                Sign
              </Dialog.PrimaryAction>
            }
          />
        </TabPanel>

        <TabPanel p={0}>
          <DappTransactionSuccess
            title="Transaction created!"
            description="Your transaction is pending to be signed. Sign at Bako Safe."
          />
        </TabPanel>

        <TabPanel p={0}>
          <DappTransactionSuccess
            title="Transaction created and signed!"
            description="Your transaction is pending to be signed by others. You can check the transaction status at Bako Safe."
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export { TransactionConfirm };
