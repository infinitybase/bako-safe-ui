import { useContactToast } from '@app/modules/addressBook/hooks';
import { useAuth } from '@app/modules/auth';
import { useWalletSignMessage } from '@app/modules/core';
import { Button } from '@chakra-ui/react';
import { TypeUser } from 'bakosafe';
import { hashMessage } from 'fuels';
import { useParams } from 'react-router-dom';

import { useTransactionSocket } from '../hooks';

export const SignMessage = () => {
  const { message } = useParams();
  const {
    signMessage: { emitSignedMessage },
  } = useTransactionSocket();
  const { warningToast } = useContactToast();
  const {
    userInfos: { type },
  } = useAuth();
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>Signing Message...</h1>
      <p>{message}</p>

      <Button
        m={10}
        variant="primary"
        fontWeight="bold"
        onClick={() =>
          signMessageRequest.mutate(
            `${type.type === TypeUser.FUEL ? message : hashMessage(message!)}`,
          )
        }
      >
        Sign message
      </Button>
    </div>
  );
};
