import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

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
  console.log(sign);
  return await UserService.signMessageWebAuthn(sign);
};

export const useDrawerWebAuth = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { location, origin } = useQueryParams();

  const createAccountMutate = useMutation({
    mutationKey: UserQueryKey.CREATE_WEB_AUTHN_ACCOUNT(),
    mutationFn: createAccount,
  });

  const signAccountMutate = useMutation({
    mutationKey: UserQueryKey.SIGN_MESSAGE_WEB_AUTHN(),
    mutationFn: signAccount,
    onSuccess: ({ user_id, avatar, accessToken, workspace, address }) => {
      auth.handlers.authenticate({
        userId: user_id,
        avatar,
        account: address,
        accountType: TypeUser.WEB_AUTHN,
        accessToken: accessToken,
        singleWorkspace: workspace.id,
        permissions: workspace.permissions,
      });
      navigate(redirectPathBuilder(!!origin, location, address));
    },
  });

  return { createAccountMutate, signAccountMutate };
};
