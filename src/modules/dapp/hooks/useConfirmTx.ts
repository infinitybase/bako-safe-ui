import { Vault } from 'bakosafe';
import { TransactionRequestLike } from 'fuels';
import { useMutation } from 'react-query';

interface IDAPPConfirmTx {
  tx: TransactionRequestLike;
  vault: Vault;
}

const useConfirmTx = () => {
  return useMutation(({ vault, tx }: IDAPPConfirmTx) =>
    vault.BakoSafeIncludeTransaction(tx),
  );
};

export { useConfirmTx };
