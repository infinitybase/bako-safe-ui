import { useWallet } from '@/modules/core';
import { useSignTransactionRequest } from '@/modules/transactions/hooks/signature/useSignTransactionRequest.ts';

export interface SignTransactionParams {
  txId: string;
  transactionID: string;
  predicateID: string;
}

const useSignTransaction = () => {
  const { data: currentWallet } = useWallet();

  const request = useSignTransactionRequest({
    onSuccess: () => alert('signed'),
    onError: () => alert('error on sign'),
  });

  const signMessage = async (params: SignTransactionParams) => {
    const signedMessage = await currentWallet?.signMessage(params.txId);

    if (!signedMessage) {
      alert('not signed');
      return;
    }

    request.mutate({
      id: params.transactionID,
      predicateID: params.predicateID,
      signer: signedMessage,
    });
  };

  return {
    request,
    signMessage,
  };
};

export { useSignTransaction };
