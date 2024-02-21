import { create } from 'zustand';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { AddressUtils, IPermissions } from '@/modules/core';

type SingleAuthentication = {
  avatar: string;
  account: string;
  workspace: string;
};

type WorkspaceAuthentication = {
  workspace: string;
  permissions: IPermissions;
};

type State = {
  avatar: string;
  account: string;
  workspaces: { single: string; workspace?: string };
  invalidAccount: boolean;
  formattedAccount: string;
  permissions?: IPermissions;
};

type Actions = {
  setInvalidAccount: (isInalid: boolean) => void;
  singleAuthentication: (params: SingleAuthentication) => void;
  workspaceAuthentication: (params: WorkspaceAuthentication) => void;
};

type Store = State & Actions;

const useAuthStore = create<Store>((set) => ({
  account: CookiesConfig.getCookie(CookieName.ADDRESS)!,
  workspaces: { single: CookiesConfig.getCookie(CookieName.SINGLE_WORKSPACE)! },
  formattedAccount: AddressUtils.format(
    CookiesConfig.getCookie(CookieName.ADDRESS)!,
  )!,
  avatar: CookiesConfig.getCookie(CookieName.AVATAR)!,
  invalidAccount: false,
  setInvalidAccount: (invalidAccount) => set({ invalidAccount }),
  singleAuthentication: (params) =>
    set({
      avatar: params.avatar,
      account: params.account,
      workspaces: { single: params.workspace },
    }),
  workspaceAuthentication: (params) =>
    set((store) => ({
      permissions: params.permissions,
      workspaces: { ...store.workspaces, workspace: params.workspace },
    })),
}));

export { useAuthStore };
