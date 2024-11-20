// import type { ITransaction } from '@bako-safe';
import { useMutation } from '@tanstack/react-query';

import { instantiateVault } from '../../vault';
import { sendTransaction } from '../sendTransaction';
import { TRANSACTION_QUERY_KEYS } from './useBakoSafeCreateTransaction';

interface UseBakoSafeSendTransactionOptions {
  onSuccess: (transactionId: string) => void;
  onError?: (transactionId: string, error: any) => void | Promise<void>;
}

interface BakoSafeSendTransactionVariables {
  transaction: Pick<any, 'id' | 'predicateId' | 'predicateAddress' | 'hash'>;
  providerUrl: string;
}

interface UseBakoSafeSendTransactionProps {
  token: string;
  userAddress: string;
  serverApi: string;
  options: UseBakoSafeSendTransactionOptions;
}

const useBakoSafeSendTransaction = ({
  options,
  serverApi,
  token,
  userAddress,
}: UseBakoSafeSendTransactionProps) => {
  return useMutation({
    mutationKey: TRANSACTION_QUERY_KEYS.SEND(),
    mutationFn: async ({
      transaction,
      providerUrl,
    }: BakoSafeSendTransactionVariables) => {
      const vaultInstance = await instantiateVault({
        predicateAddress: transaction.predicateAddress,
        providerUrl,
        token,
        userAddress,
        serverApi,
      });

      try {
        await sendTransaction(vaultInstance, transaction.hash);

        return transaction.id;
      } catch (e) {
        options?.onError?.(transaction.id, e);
        throw e;
      }
    },

    onSuccess: options.onSuccess,
  });
};

export { useBakoSafeSendTransaction };
