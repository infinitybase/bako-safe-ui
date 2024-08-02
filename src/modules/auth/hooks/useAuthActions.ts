import { useState, useCallback } from 'react';

import { AddressUtils, IPermission } from '@/modules/core';
import { SignWebAuthnPayload, TypeUser } from '../services';
import { useUserInfo } from './useUserInfo';

export type SingleAuthentication = {
  avatar: string;
  account: string;
  accountType: TypeUser;
  userId: string;
  workspace: string;
  webAuthn?: Omit<SignWebAuthnPayload, 'challenge'>;
};

export type WorkspaceAuthentication = {
  workspace: string;
  permissions: IPermission;
};

export type IUseAuthActionsState = {
  avatar: string;
  account: string;
  accountType?: TypeUser;
  userId: string;
  workspaces: { single: string; current: string };
  isInvalidAccount: boolean;
  formattedAccount: string;
  permissions?: IPermission;
  webAuthn?: Omit<SignWebAuthnPayload, 'challenge'>;
};

export type IUseAuthActionHandler = {
  logout: () => void;
  setInvalidAccount: (isInvalid: boolean) => void;
  singleAuthentication: (params: SingleAuthentication) => void;
  workspaceAuthentication: (params: WorkspaceAuthentication) => void;
  workspaceAuthenticationSingle: () => void;
};

export type IUseAuthActions = IUseAuthActionsState & IUseAuthActionHandler;

const useAuthActions = (): IUseAuthActions => {
  const { userInfos } = useUserInfo();

  const [state, setState] = useState<IUseAuthActionsState>({
    ...userInfos,
    isInvalidAccount: false,
  });

  const setInvalidAccount = useCallback((invalidAccount: boolean) => {
    setState((prevState) => ({ ...prevState, invalidAccount }));
  }, []);

  const singleAuthentication = useCallback((params: SingleAuthentication) => {
    setState({
      accountType: params.accountType,
      userId: params.userId,
      avatar: params.avatar,
      account: params.account,
      workspaces: { single: params.workspace, current: params.workspace },
      isInvalidAccount: false,
      formattedAccount: AddressUtils.format(params.account) ?? '',
      webAuthn: params.webAuthn,
    });
  }, []);

  const workspaceAuthentication = useCallback(
    (params: WorkspaceAuthentication) => {
      setState((prevState) => ({
        ...prevState,
        permissions: params.permissions,
        workspaces: { ...prevState.workspaces, current: params.workspace },
      }));
    },
    [],
  );

  const workspaceAuthenticationSingle = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      permissions: undefined,
      workspaces: {
        ...prevState.workspaces,
        current: prevState.workspaces.single,
      },
    }));
  }, []);

  const logout = () => {
    setState({
      account: '',
      accountType: undefined,
      userId: '',
      avatar: '',
      workspaces: { single: '', current: '' },
      isInvalidAccount: false,
      formattedAccount: '',
      permissions: undefined,
      webAuthn: undefined,
    });
  };

  return {
    ...state,
    setInvalidAccount,
    singleAuthentication,
    workspaceAuthentication,
    workspaceAuthenticationSingle,
    logout,
  };
};

export { useAuthActions };
