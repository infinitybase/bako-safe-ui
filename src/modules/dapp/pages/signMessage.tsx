import { useWalletSignMessage } from '@/modules/core';
import { useContactToast } from '@/modules';
import { useTransactionSocket } from '../hooks';
import { useParams } from 'react-router-dom';

export const SignMessage = () => {
  const { message } = useParams();
  const {
    signMessage: { emitSignedMessage },
  } = useTransactionSocket();
  const { warningToast } = useContactToast();

  const signMessageRequest = useWalletSignMessage({
    onSuccess: (signedMessage) => {
      emitSignedMessage(signedMessage);
    },
    onError: (e) => {
      console.log(e);
      warningToast({
        title: 'Signature failed',
        description: 'Please try again!',
      });
    },
  });

  return (
    <div>
      <h1>Signing Message...</h1>
      <p>{message}</p>
      <button onClick={() => signMessageRequest.mutate(message!)}>Sign</button>
    </div>
  );
};
