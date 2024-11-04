import { ITransaction } from '@bako-safe/services';
import { useMutation } from '@tanstack/react-query';

import { instantiateVault } from '../../vault';
import { sendTransaction } from '../sendTransaction';
import { TRANSACTION_QUERY_KEYS } from './useBakoSafeCreateTransaction';

interface UseBakoSafeSendTransactionParams {
  onSuccess: () => boolean;
  onError?: (
    transaction: BakoSafeTransactionSendVariables['transaction'],
    error: any,
  ) => void | Promise<void>;
}

interface BakoSafeTransactionSendVariables {
  transaction: Pick<
    ITransaction,
    'id' | 'predicateId' | 'predicateAddress' | 'hash'
  >;
  providerUrl: string;
  token: string;
  userAddress: string;
  serverApi: string;
}

const useBakoSafeTransactionSend = (
  options: UseBakoSafeSendTransactionParams,
) => {
  return useMutation({
    mutationKey: TRANSACTION_QUERY_KEYS.SEND(),
    mutationFn: async ({
      transaction,
      providerUrl,
      token,
      userAddress,
      serverApi,
    }: BakoSafeTransactionSendVariables) => {
      const vaultInstance = await instantiateVault({
        predicateAddress: transaction.predicateAddress,
        providerUrl,
        token,
        userAddress,
        serverApi,
      });

      try {
        const tx = await sendTransaction(vaultInstance, transaction.hash);

        const { isStatusSuccess } = await tx.waitForResult();

        return isStatusSuccess;
      } catch (e) {
        options?.onError?.(transaction, e);
        throw e;
      }
    },

    onSuccess: options.onSuccess,
  });
};

export { useBakoSafeTransactionSend };
