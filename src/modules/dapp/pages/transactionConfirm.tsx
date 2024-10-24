import { TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useState } from 'react';

import { Dialog } from '@/components/dialog';
import CreateTxMenuButton, {
  ECreateTransactionMethods,
} from '@/modules/transactions/components/dialog/create/createTxMenuButton';

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

  return (
    <Tabs isLazy index={tabs.tab}>
      <TabPanels>
        <TabPanel p={0}>
          <DappTransactionWrapper
            title="Create transaction"
            validAt={validAt}
            vault={vault}
            pendingSignerTransactions={pendingSignerTransactions}
            summary={summary}
            primaryActionLoading={isSending}
            cancel={cancelSendTransaction}
            primaryActionButton={
              <CreateTxMenuButton
                createTxMethod={createTxMethod}
                setCreateTxMethod={setCreateTxMethod}
                isLoading={isSending}
                isDisabled={isSending}
                handleCreateTransaction={sendTransaction}
                handleCreateAndSignTransaction={sendTransactionAndSign}
              />
            }
          />
        </TabPanel>

        <TabPanel p={0}>
          <DappTransactionWrapper
            title="Sign transaction"
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
                onClick={() => signTransaction()}
                fontWeight={700}
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
