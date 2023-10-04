import { useMutation } from 'react-query';

import { useToast, useWallet } from '@/modules/core';
import { useSignTransactionRequest } from '@/modules/transactions/hooks/signature/useSignTransactionRequest';

export interface SignTransactionParams {
  txId: string;
  transactionID: string;
  predicateID: string;
}

export interface UseSignTransactionOptions {
  onSuccess: () => void;
}

const useSignTransaction = (options?: UseSignTransactionOptions) => {
  const { data: currentWallet } = useWallet();
  const toast = useToast();

  const request = useSignTransactionRequest({
    onSuccess: () => {
      toast.update({
        status: 'success',
        title: 'Transaction signed',
        position: 'bottom',
        isClosable: true,
        duration: 5000,
      });

      options?.onSuccess();
    },
    onError: () => {
      toast.update({
        status: 'error',
        title: 'Error on sign transaction',
        position: 'bottom',
        isClosable: true,
        duration: 5000,
      });
    },
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
      onMutate: () => {
        toast.show({
          status: 'info',
          title: 'Sign transaction...',
          position: 'bottom',
          duration: 100000,
        });
      },
      onSuccess: (response) => {
        if (!response.signedMessage) {
          toast.update({
            status: 'error',
            title: 'Message sign rejected',
            position: 'bottom',
            duration: 100000,
          });
          return;
        }

        request.mutate({
          id: response.transactionID,
          account: currentWallet!.address.toString(),
          signer: response.signedMessage,
        });
      },
      onError: () =>
        toast.update({
          status: 'error',
          title: 'Error on sign transaction',
          position: 'bottom',
          isClosable: true,
          duration: 5000,
        }),
    },
  );

  return {
    request,
    signMessageRequest,
  };
};

export { useSignTransaction };
