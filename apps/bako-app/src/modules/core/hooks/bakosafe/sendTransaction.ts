import { TransactionStatus, Vault } from 'bakosafe';

import { transactionService } from '@/modules/services/services-initializer';

const sendTransaction = async (vault: Vault, transactionHash: string) => {
  const { tx } = await vault.transactionFromHash(transactionHash);

  await vault.send(tx);

  const txResult = await transactionService.getByHash(transactionHash, [
    TransactionStatus.PENDING_SENDER,
    TransactionStatus.PROCESS_ON_CHAIN,
    TransactionStatus.FAILED,
    TransactionStatus.SUCCESS,
  ]);

  return txResult;
};

export { sendTransaction };
