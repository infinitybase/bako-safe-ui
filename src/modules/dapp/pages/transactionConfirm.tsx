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

import { useTransactionSocket } from '../hooks';

const TransactionConfirm = () => {
  const {
    init,
    confirmTransaction,
    cancelTransaction,
    confirmingTransaction,
    vault,
    connection,
    summary: { transactionSummary, isLoading: isLoadingTransactionSummary },
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
            name={vault.name}
            address={vault.address.toString()}
            description={vault.description}
            isSingleWorkspace
            isActive
          />
        )}
      </Dapp.Section>

      <Divider borderColor="dark.100" mb={7} />

      {/* DApp infos */}

      <Dapp.Section>
        <DappConnectionDetail
          title={connection.name!}
          origin={connection.origin!}
        />
      </Dapp.Section>

      {/* Alert */}
      <Dapp.Section>
        <DappConnectionAlert />
      </Dapp.Section>

      <Divider w="full" borderColor="dark.100" mb={7} />

      {/* Transaction Summary */}
      <VStack spacing={1}>
        {(isLoadingTransactionSummary || !transactionSummary) && (
          <DappTransaction.OperationSkeleton />
        )}
        {transactionSummary?.operations?.map((operation, index) => (
          <DappTransaction.Operation
            key={`${index}operation`}
            vault={{
              name: vault?.BSAFEVault.name ?? '',
              predicateAddress: vault?.BSAFEVault.predicateAddress ?? '',
            }}
            operation={operation}
          />
        ))}
      </VStack>

      <DappTransaction.Fee fee={transactionSummary?.fee?.format()} />

      {/* Actions */}
      <Dialog.Actions
        hidden={isLoadingTransactionSummary || !transactionSummary}
        w="full"
      >
        <Dialog.SecondaryAction
          size="lg"
          onClick={cancelTransaction}
          isDisabled={confirmingTransaction}
        >
          Reject
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          size="lg"
          isLoading={confirmingTransaction}
          leftIcon={<SquarePlusIcon fontSize="lg" />}
          onClick={confirmTransaction}
        >
          Create transaction
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dapp.Content>
  );
};

export { TransactionConfirm };
