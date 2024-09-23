import { useState } from 'react';

import { useContactToast } from '@/modules/addressBook/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TypeUser, UserService } from '../../services';
import { WebAuthnModeState } from '../signIn/useWebAuthnSignIn';
import { UseWebAuthnForm } from './useWebAuthnForm';
import { useWebAuthnLastLogin } from './useWebAuthnLastLogin';
import { useSignMessageWebAuthn } from './useWebauthnRequests';

interface UseWebAuthnSignInParams {
  form: UseWebAuthnForm['form'];
  setMode: (mode: WebAuthnModeState) => void;
  callback: (vaultId?: string, workspaceId?: string) => void;
}

const verifyNickname = async (username: string) => {
  return await UserService.verifyNickname(username);
};

const generateSignInCode = async (address: string) => {
  return await UserService.generateSignInCode(address);
};

const useWebAuthnSignInMode = (params: UseWebAuthnSignInParams) => {
  const { form, setMode, callback } = params;

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInProgress, setSignInProgress] = useState(0);

  const {
    authDetails,
    screenSizes: { isSmall },
    invalidateGifAnimationRequest,
  } = useWorkspaceContext();

  const { warningToast } = useContactToast();
  const signMesageWebAuthn = useSignMessageWebAuthn();
  const { setLastLoginUsername } = useWebAuthnLastLogin();

  const handleLogin = form.handleSubmit(async ({ username }) => {
    setIsSigningIn(true);

    const acc = await verifyNickname(username);

    if (!acc?.address || !acc.webauthn) {
      setSignInProgress(0);
      setIsSigningIn(false);
      setMode(WebAuthnModeState.REGISTER);
      return;
    }

    setSignInProgress(33);

    const { code } = await generateSignInCode(acc.address);

    setSignInProgress(66);

    await signMesageWebAuthn.mutateAsync(
      {
        id: acc.webauthn.id,
        challenge: code,
        publicKey: acc.webauthn.publicKey,
      },
      {
        onSuccess: ({
          user_id,
          avatar,
          accessToken,
          workspace,
          address,
          rootWallet,
          webAuthn,
        }) => {
          setSignInProgress(100);
          setTimeout(() => {
            invalidateGifAnimationRequest && invalidateGifAnimationRequest();
            setIsSigningIn(false);
            setLastLoginUsername(username);

            authDetails.handlers.authenticate({
              userId: user_id,
              avatar,
              account: address,
              accountType: TypeUser.WEB_AUTHN,
              accessToken: accessToken,
              singleWorkspace: workspace.id,
              permissions: workspace.permissions,
              webAuthn,
            });
            callback(rootWallet, workspace.id);
          }, 800);
        },
        onError: () => {
          setSignInProgress(0);
          setIsSigningIn(false);
          warningToast({
            title: 'Problem to sign',
            description:
              'We can not validate your signature. Please, try again.',
            position: isSmall ? 'bottom' : 'top-right',
          });
        },
      },
    );
  });

  return { isSigningIn, signInProgress, handleLogin };
};

export { useWebAuthnSignInMode };
