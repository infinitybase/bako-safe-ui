import { useMutation } from 'react-query';

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

  // Todo: Refactor to other directory/file
  const signMessageRequest = useMutation(
    'wallet/sign',
    async (params: SignTransactionParams) => {
      const signedMessage = await currentWallet?.signMessage(params.txId);
      return {
        ...params,
        signedMessage,
      };
    },
    {
      onSuccess: (response) => {
        if (!response.signedMessage) {
          alert('not signed');
          return;
        }

        request.mutate({
          id: response.transactionID,
          predicateID: response.predicateID,
          signer: response.signedMessage,
        });
      },
      onError: () => alert('erro on sign message'),
    },
  );

  return {
    request,
    signMessageRequest,
  };
};

export { useSignTransaction };
