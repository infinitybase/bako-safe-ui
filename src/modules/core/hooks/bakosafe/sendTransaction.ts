import { TransactionStatus, Vault } from 'bakosafe';

import { TransactionService } from '@/modules/transactions/services';

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
