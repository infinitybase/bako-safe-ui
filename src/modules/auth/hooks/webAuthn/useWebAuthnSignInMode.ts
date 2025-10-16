import { useState } from 'react';

import { LocalStorageConfig } from '@/config';
import { useContactToast } from '@/modules/addressBook/hooks';
import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { localStorageKeys, TypeUser, UserService } from '../../services';
import { WebAuthnModeState } from '../signIn/useWebAuthnSignIn';
import { UseWebAuthnForm } from './useWebAuthnForm';
import { useWebAuthnLastLogin } from './useWebAuthnLastLogin';
import { useSignMessageWebAuthn } from './useWebauthnRequests';

interface UseWebAuthnSignInParams {
  form: UseWebAuthnForm['form'];
  setMode: (mode: WebAuthnModeState) => void;
  callback: (vaultId?: string, workspaceId?: string) => void;
}

const getByName = async (name: string) => {
  return await UserService.getByName(name);
};

const generateSignInCode = async (name: string, networkUrl?: string) => {
  return await UserService.generateSignInCode(name, networkUrl);
};

const useWebAuthnSignInMode = (params: UseWebAuthnSignInParams) => {
  const { form, setMode, callback } = params;

  const [isSigningIn, setIsSigningIn] = useState(false);

  const { authDetails } = useWorkspaceContext();

  const { warningToast } = useContactToast();
  const signMesageWebAuthn = useSignMessageWebAuthn();
  const { setLastLoginUsername } = useWebAuthnLastLogin();
  const { fromConnector } = useNetworks();

  const handleLogin = form.handleSubmit(async ({ username }) => {
    setIsSigningIn(true);

    const acc = await getByName(username);

    if (!acc.webAuthnId) {
      setIsSigningIn(false);
      setMode(WebAuthnModeState.REGISTER);
      return;
    }

    const { code } = await generateSignInCode(
      username,
      fromConnector
        ? localStorage.getItem(localStorageKeys.SELECTED_NETWORK)!
        : import.meta.env.VITE_MAINNET_NETWORK,
    );

    await signMesageWebAuthn.mutateAsync(
      {
        id: acc.webAuthnId,
        challenge: code,
        name: username,
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
          setTimeout(() => {
            // invalidateGifAnimationRequest && invalidateGifAnimationRequest();
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
              provider_url: import.meta.env.VITE_PROVIDER_URL,
            });
            callback(rootWallet, workspace.id);
          }, 800);

          if (fromConnector) {
            localStorage.removeItem(localStorageKeys.SELECTED_NETWORK);
          }
        },
        onError: () => {
          setIsSigningIn(false);
          warningToast({
            title: 'Problem to sign',
            description:
              'We can not validate your signature. Please, try again.',
          });
        },
      },
    );

    const storageUsernames = LocalStorageConfig.getItem<string[]>(
      localStorageKeys.USERNAMES,
    );

    const alreadySaveUsername = storageUsernames?.find(
      (name) => name === username,
    );

    if (!alreadySaveUsername) {
      LocalStorageConfig.pushItem(localStorageKeys.USERNAMES, username);
    }
  });

  return { isSigningIn, handleLogin };
};

export { useWebAuthnSignInMode };
