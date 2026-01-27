import { useMutation } from '@tanstack/react-query';
import { TransactionStatus, Vault } from 'bakosafe';
import { TransactionRequestLike } from 'fuels';

import { queryClient } from '@/config';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { TransactionService } from '@/modules/transactions/services';

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
    signTransaction: { confirmTransaction },
    pendingSignerTransactions,
  } = useTransactionsContext();
  const { mutateAsync: sendTx, ...rest } = useMutation({
    mutationKey: ['swap'],
    mutationFn: async ({
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
      const vaultTx = await vault.BakoTransfer(tx, {
        name: `Swap ${assetIn} to ${assetOut}`,
      });

      const transaction = await TransactionService.getByHash(vaultTx.hashTxId, [
        TransactionStatus.AWAIT_REQUIREMENTS,
      ]);

      await refetchTransactionsList();
      await refetchHomeTransactionsList();
      await refetchVaultTransactionsList();
      await pendingSignerTransactions.refetch();

      await confirmTransaction(transaction.id, undefined, transaction).finally(
        () => {
          queryClient.invalidateQueries({
            queryKey: ['vaultAssetsBalances', vault?.address],
          });
        },
      );

      return vaultTx;
    },
  });

  return { sendTx, ...rest };
};
