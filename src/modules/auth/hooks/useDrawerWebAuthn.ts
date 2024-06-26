import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useScreenSize } from '@/modules/core';

import {
  SignWebAuthnPayload,
  TypeUser,
  UserQueryKey,
  UserService,
} from '../services';
import { useAuth } from './useAuth';
import { useQueryParams } from './usePopup';
import { redirectPathBuilder } from './useSignIn';

const createAccount = async (name: string) => {
  return await UserService.createWebAuthnAccount(name);
};

const signAccount = async (sign: SignWebAuthnPayload) => {
  return await UserService.signMessageWebAuthn(sign);
};

export const useDrawerWebAuth = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { isSmall } = useScreenSize();
  const { warningToast } = useContactToast();

  const { location, sessionId } = useQueryParams();

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
        auth.handlers.authenticate({
          userId: user_id,
          avatar,
          account: address,
          accountType: TypeUser.WEB_AUTHN,
          accessToken: accessToken,
          singleWorkspace: workspace.id,
          permissions: workspace.permissions,
          webAuthn,
        });
        navigate(redirectPathBuilder(!!sessionId, location, address));
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
