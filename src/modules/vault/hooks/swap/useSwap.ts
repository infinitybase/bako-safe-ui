import { useMutation } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { TransactionRequestLike } from 'fuels';

export const useSwap = () => {
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
  });

  return { sendTx, ...rest };
};
