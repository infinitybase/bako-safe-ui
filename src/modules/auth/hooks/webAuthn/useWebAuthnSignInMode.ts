import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWebAuthnLastLogin } from '@/modules';
import { useContactToast } from '@/modules/addressBook/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TypeUser, UserService } from '../../services';
import { SignInOrigin, useSignInOriginFactory } from '../signIn';
import { WebAuthnModeState } from '../signIn/useWebAuthnSignIn';
import { useQueryParams } from '../usePopup';
import { UseWebAuthnForm } from './useWebAuthnForm';
import { useSignMessageWebAuthn } from './useWebauthnRequests';

const verifyNickname = async (username: string) => {
  return await UserService.verifyNickname(username);
};

const generateSignInCode = async (address: string) => {
  return await UserService.generateSignInCode(address);
};

const useWebAuthnSignInMode = (
  form: UseWebAuthnForm['form'],
  setMode: (mode: WebAuthnModeState) => void,
) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInProgress, setSignInProgress] = useState(0);

  const {
    authDetails,
    screenSizes: { isSmall },
    invalidateGifAnimationRequest,
  } = useWorkspaceContext();

  const navigate = useNavigate();
  const { sessionId } = useQueryParams();
  const { warningToast } = useContactToast();
  const signMesageWebAuthn = useSignMessageWebAuthn();
  const { setLastLoginUsername } = useWebAuthnLastLogin();

  const signInOrigin = sessionId ? SignInOrigin.DAPP : SignInOrigin.WEB;
  const { redirect } = useSignInOriginFactory(signInOrigin);

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
            navigate(redirect(rootWallet, workspace.id));
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
