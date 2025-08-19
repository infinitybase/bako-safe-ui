import { useMutation } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { TransactionRequestLike } from 'fuels';

import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';

export const useSwap = () => {
  const {
    transactionsPageList: {
      request: { refetch: refetchTransactionsList },
    },
    homeTransactions: {
      request: { refetch: refetchHomeTransactionsList },
    },
    vaultTransactions: {
      request: { refetch: refetchVaultTransactionsList },
    },
  } = useTransactionsContext();
  const { mutateAsync: sendTx, ...rest } = useMutation({
    mutationKey: ['swap'],
    mutationFn: ({
      vault,
      tx,
      assetIn,
      assetOut,
    }: {
      vault?: Vault;
      tx: TransactionRequestLike;
      assetIn: string;
      assetOut: string;
    }) => {
      if (!vault) {
        throw new Error('Vault is not available');
      }
      return vault.BakoTransfer(tx, { name: `Swap ${assetIn} to ${assetOut}` });
    },
    onSuccess: () => {
      refetchTransactionsList();
      refetchHomeTransactionsList();
      refetchVaultTransactionsList();
    },
  });

  return { sendTx, ...rest };
};
