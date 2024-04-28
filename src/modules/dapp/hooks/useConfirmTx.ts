import { Vault } from 'bsafe';
import { TransactionRequestLike } from 'fuels';
import { useMutation } from 'react-query';

interface IDAPPConfirmTx {
  tx: TransactionRequestLike;
  vault: Vault;
}

const useConfirmTx = () => {
  return useMutation(({ vault, tx }: IDAPPConfirmTx) =>
    vault.BSAFEIncludeTransaction(tx),
  );
};

export { useConfirmTx };
