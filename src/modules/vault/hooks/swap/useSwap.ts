import { useMutation } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { TransactionRequestLike } from 'fuels';

export const useSwap = () => {
  const { mutateAsync: sendTx, ...rest } = useMutation({
    mutationKey: ['swap'],
    mutationFn: ({
      vault,
      tx,
    }: {
      vault?: Vault;
      tx: TransactionRequestLike;
    }) => {
      if (!vault) {
        throw new Error('Vault is not available');
      }
      return vault.sendTransaction(tx);
    },
  });

  return { sendTx, ...rest };
};
