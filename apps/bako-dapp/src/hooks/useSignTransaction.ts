import { useContactToast } from '@app/modules/addressBook/hooks';
import { useWalletSignMessage } from '@app/modules/core';

const useSignTransaction = () => {
  const { warningToast } = useContactToast();

  const signMessageRequest = useWalletSignMessage({
    onError: () => {
      warningToast({
        title: 'Signature failed',
        description: 'Please try again!',
      });
    },
  });

  const confirmSignTransaction = async (
    transactionHash: string,
    callback: (signedMessage: string) => void,
  ) => {
    const signedMessage = await signMessageRequest.mutateAsync(transactionHash);
    callback(signedMessage);
  };

  return {
    confirmSignTransaction,
  };
};

export { useSignTransaction };
