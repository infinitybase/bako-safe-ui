import { useContactToast } from '@app/modules/addressBook/hooks';
import { useWalletSignMessage } from '@bako-safe/wallet/fuel';

import { useAuthContext } from '../../../bako-app/src/modules/auth/AuthProvider';

const useSignTransaction = () => {
  const { warningToast } = useContactToast();

  const {
    userInfos: { address, type, webauthn },
  } = useAuthContext();

  const signMessageRequest = useWalletSignMessage(
    address,
    type.type,
    webauthn?.id,
    webauthn?.publicKey,
    {
      onError: () => {
        warningToast({
          title: 'Signature failed',
          description: 'Please try again!',
        });
      },
    },
  );

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
