import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { AddressUtils, IPermission } from '@/modules/core';

type SingleAuthentication = {
  avatar: string;
  account: string;
  userId: string;
  workspace: string;
};

type WorkspaceAuthentication = {
  workspace: string;
  permissions: IPermission;
};

type State = {
  avatar: string;
  account: string;
  userId: string;
  workspaces: { single: string; current: string };
  invalidAccount: boolean;
  formattedAccount: string;
  permissions?: IPermission;
};

type Actions = {
  logout: () => void;
  setInvalidAccount: (isInalid: boolean) => void;
  singleAuthentication: (params: SingleAuthentication) => void;
  workspaceAuthentication: (params: WorkspaceAuthentication) => void;
  workspaceAuthenticationSingle: () => void;
};

type Store = State & Actions;

const useAuthStore = create<Store>()(
  devtools((set) => ({
    account: CookiesConfig.getCookie(CookieName.ADDRESS)!,
    userId: CookiesConfig.getCookie(CookieName.USER_ID)!,
    workspaces: {
      single: CookiesConfig.getCookie(CookieName.SINGLE_WORKSPACE)!,
      current: CookiesConfig.getCookie(CookieName.SINGLE_WORKSPACE)!,
    },
    formattedAccount: AddressUtils.format(
      CookiesConfig.getCookie(CookieName.ADDRESS)!,
    )!,
    avatar: CookiesConfig.getCookie(CookieName.AVATAR)!,
    invalidAccount: false,
    setInvalidAccount: (invalidAccount) => set({ invalidAccount }),
    singleAuthentication: (params) =>
      set({
        userId: params.userId,
        avatar: params.avatar,
        account: params.account,
        workspaces: { single: params.workspace, current: params.workspace },
      }),
    workspaceAuthentication: (params) =>
      set((store) => ({
        permissions: params.permissions,
        workspaces: { ...store.workspaces, current: params.workspace },
      })),
    workspaceAuthenticationSingle: () => {
      set((store) => ({
        permissions: undefined,
        workspaces: { ...store.workspaces, current: store.workspaces.single },
      }));
    },
    logout: () =>
      set({
        userId: '',
        avatar: '',
        account: '',
        permissions: undefined,
        workspaces: { single: '', current: '' },
      }),
  })),
);

export { useAuthStore };
