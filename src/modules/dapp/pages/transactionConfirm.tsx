import { Divider, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { Dialog, SquarePlusIcon } from '@/components';
import { Dapp } from '@/layouts';
import { useQueryParams } from '@/modules/auth';
import {
  DappConnectionAlert,
  DappConnectionDetail,
  DappTransaction,
} from '@/modules/dapp/components';
import { useHome } from '@/modules/home/hooks/useHome';
import { VaultDrawerBox } from '@/modules/vault/components/drawer/box';

import { DappError } from '../components/connection';
import { useTransactionSocket } from '../hooks';

const TransactionConfirm = () => {
  const {
    init,
    cancelTransaction,
    vault,
    pendingSignerTransactions,
    connection,
    summary: { transactionSummary, isLoading: isLoadingTransactionSummary },
    isLoading,
    send,
  } = useTransactionSocket();
  const { sessionId } = useQueryParams();

  const { goHome } = useHome();

  if (!sessionId) {
    window.close();
    goHome();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Dapp.Content>
      <Dapp.Section>
        <Dapp.Header
          title="Create transaction"
          description="Enhance your security by sending transactions and executing contracts through BSafe."
        />
      </Dapp.Section>

      {/* Vault */}
      <Dapp.Section>
        {vault && (
          <VaultDrawerBox
            name={vault?.name}
            address={vault?.address}
            description={vault?.description}
            isSingleWorkspace
            isActive
          />
        )}
      </Dapp.Section>

      <Divider borderColor="dark.100" mb={7} />

      <Dapp.Section>
        <DappConnectionDetail
          title={connection?.name ?? ''}
          origin={connection?.origin ?? ''}
        />
      </Dapp.Section>

      <Dapp.Section>
        {pendingSignerTransactions ? <DappError /> : <DappConnectionAlert />}
      </Dapp.Section>
      {!pendingSignerTransactions && (
        <>
          <Divider w="full" borderColor="dark.100" mb={7} />

          <VStack spacing={1}>
            {(isLoadingTransactionSummary || !transactionSummary) && (
              <DappTransaction.OperationSkeleton />
            )}

            {transactionSummary?.operations?.map((operation, index) => (
              <DappTransaction.Operation
                key={`${index}operation`}
                vault={{
                  name: vault?.name || '',
                  predicateAddress: vault?.address || '',
                }}
                operation={operation}
              />
            ))}
          </VStack>

          <DappTransaction.Fee fee={transactionSummary?.fee} />
        </>
      )}
      {/* Actions */}
      <Dialog.Actions
        hidden={isLoadingTransactionSummary || !transactionSummary}
        w="full"
      >
        {!pendingSignerTransactions ? (
          <>
            <Dialog.SecondaryAction
              size="lg"
              onClick={cancelTransaction}
              isDisabled={isLoading}
            >
              Reject
            </Dialog.SecondaryAction>
            <Dialog.PrimaryAction
              size="lg"
              isLoading={isLoading}
              leftIcon={<SquarePlusIcon fontSize="lg" />}
              onClick={send}
            >
              Create transaction
            </Dialog.PrimaryAction>
          </>
        ) : (
          <>
            <Dialog.SecondaryAction
              size="lg"
              width="full"
              onClick={cancelTransaction}
              isDisabled={isLoading}
            >
              Back
            </Dialog.SecondaryAction>
          </>
        )}
      </Dialog.Actions>
    </Dapp.Content>
  );
};

export { TransactionConfirm };
