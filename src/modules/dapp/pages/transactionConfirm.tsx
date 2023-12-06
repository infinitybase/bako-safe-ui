import { Divider, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Dialog, SquarePlusIcon } from '@/components';
import { Dapp } from '@/layouts';
import { useQueryParams } from '@/modules/auth';
import { Pages } from '@/modules/core';
import {
  DappConnectionAlert,
  DappConnectionDetail,
  DappTransaction,
} from '@/modules/dapp/components';
import { VaultDrawerBox } from '@/modules/vault/components/drawer/box';

import { useTransactionSocket } from '../hooks';

const TransactionConfirm = () => {
  const {
    init,
    confirmTransaction,
    cancelTransaction,
    vault,
    connection,
    summary: { transactionSummary, isLoading: isLoadingTransactionSummary },
  } = useTransactionSocket();
  const { sessionId } = useQueryParams();
  const navigate = useNavigate();

  if (!sessionId) {
    window.close();
    navigate(Pages.home());
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log({ transactionSummary });
  }, [transactionSummary]);

  return (
    <Dapp.Content>
      <Dapp.Section>
        <Dapp.Header
          title="Create transaction"
          description="Setting Sail on a Journey to Unlock the Potential of User-Centered Design."
        />
      </Dapp.Section>

      {/* Vault */}
      <Dapp.Section>
        {vault && (
          <VaultDrawerBox
            name={vault.name}
            address={vault.address.toString()}
            description={vault.description}
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
        <DappConnectionAlert origin={connection.origin!} />
      </Dapp.Section>

      <Divider borderColor="dark.100" mb={7} />

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

      <Divider borderColor="dark.100" mb={7} />

      {/* Actions */}
      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction size="lg" onClick={cancelTransaction}>
          Reject
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          size="lg"
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
