import { bn } from 'fuels';
import { useMutation, UseMutationOptions } from 'react-query';

import { BsafeProvider } from '@/modules/core';
import {
  GetTransactionResponse,
  TransactionService,
} from '@/modules/transactions/services';
import { VaultService } from '@/modules/vault';

export interface SendTransferParams {
  transaction: GetTransactionResponse;
}

const sendTransfer = async ({ transaction }: SendTransferParams) => {
  try {
    const predicate = await VaultService.getById(transaction.predicateID);
    const vault = BsafeProvider.instanceVault(predicate);
    const balances = await vault.getBalances();
    const hasAssets = transaction.assets.every((asset) => {
      const assetBalance = balances.find(
        (balance) => balance.assetId === asset.assetID,
      );

      if (!assetBalance) return false;

      return assetBalance.amount.gte(bn.parseUnits(asset.amount));
    });

    if (!hasAssets)
      throw new Error('Insufficient assets to send this transaction');

    const transactionInstance = await BsafeProvider.instanceTransaction({
      predicate: vault,
      assets: transaction.assets,
      witnesses: transaction.witnesses
        .filter((witness) => !!witness.signature)
        .map((witness) => witness.signature!),
    });

    const result = await transactionInstance.sendTransaction();

    return TransactionService.close(transaction?.id, {
      gasUsed: result.gasUsed,
      transactionResult: JSON.stringify(result),
      hasError: result.status === 'failure',
    });
  } catch (e) {
    await TransactionService.close(transaction?.id, {
      gasUsed: '0',
      transactionResult: '{}',
      hasError: true,
    });

    throw e;
  }
};

const useTransactionSendRequest = (
  options?: UseMutationOptions<
    GetTransactionResponse,
    unknown,
    SendTransferParams
  >,
) => {
  return useMutation('transaction/send', sendTransfer, options);
};

export { useTransactionSendRequest };
