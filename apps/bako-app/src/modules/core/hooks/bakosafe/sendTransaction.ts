import { TransactionService } from '@bako-safe/services/modules/transaction';
import { TransactionStatus, Vault } from 'bakosafe';

const sendTransaction = async (vault: Vault, transactionHash: string) => {
  const { tx } = await vault.transactionFromHash(transactionHash);

  await vault.send(tx);

  const txResult = await TransactionService.getByHash(transactionHash, [
    TransactionStatus.PENDING_SENDER,
    TransactionStatus.PROCESS_ON_CHAIN,
    TransactionStatus.FAILED,
    TransactionStatus.SUCCESS,
  ]);

  return txResult;
};

export { sendTransaction };
