import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import {
  SignWebAuthnPayload,
  TypeUser,
  UserQueryKey,
  UserService,
} from '../services';
import { SignInOrigin } from './signIn/types';
import { useSignInFactory } from './signIn/useSignInFactory';
import { useQueryParams } from './usePopup';

const createAccount = async (name: string) => {
  return await UserService.createWebAuthnAccount(name);
};

const signAccount = async (sign: SignWebAuthnPayload) => {
  return await UserService.signMessageWebAuthn(sign);
};

export const useDrawerWebAuth = () => {
  const {
    authDetails,
    screenSizes: { isSmall },
  } = useWorkspaceContext();
  const navigate = useNavigate();
  const { warningToast } = useContactToast();

  const { sessionId } = useQueryParams();
  const signInOrigin = sessionId ? SignInOrigin.DAPP : SignInOrigin.WEB;
  const { redirect } = useSignInFactory(signInOrigin);

  const createAccountMutate = useMutation({
    mutationKey: UserQueryKey.CREATE_WEB_AUTHN_ACCOUNT(),
    mutationFn: createAccount,
  });

  const signAccountMutate = useMutation({
    mutationKey: UserQueryKey.SIGN_MESSAGE_WEB_AUTHN(),
    mutationFn: signAccount,
    onSuccess: ({
      user_id,
      avatar,
      accessToken,
      workspace,
      address,
      webAuthn,
    }) => {
      setTimeout(() => {
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
        navigate(redirect());
      }, 800);
    },
    onError: () => {
      warningToast({
        title: 'Problem to sign',
        description: 'We can not validate your signature. Please, try again.',
        position: isSmall ? 'bottom' : 'top-right',
      });
    },
  });

  return { createAccountMutate, signAccountMutate };
};
