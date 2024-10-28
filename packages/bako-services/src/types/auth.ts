import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Network, Provider } from "fuels";

import { IPermission, Workspace } from "@/services/workspace/types";
import { EConnectors } from "@/modules/auth/hooks";
import { TypeUser } from "bakosafe";

export enum Encoder {
  FUEL = "FUEL",
  METAMASK = "METAMASK",
  WEB_AUTHN = "WEB_AUTHN",
}

export type SignWebAuthnPayload = {
  id: string;
  challenge: string;
  publicKey: string;
};

export type SignInSignWebAuthnPayload = Omit<
  SignWebAuthnPayload,
  "publicKey"
> & {
  name: string;
};

export type CreateUserResponse = {
  id: string;
  code: string;
  type: TypeUser;
};

export type UseSignInRequestParams = {
  code: string;
  type: TypeUser;
};

export type CreateUserPayload = {
  address: string;
  provider: string;
  type: TypeUser;
  webauthn?: {
    id: string;
    publicKey: string;
    origin: string;
  };
};

export type SignInPayload = {
  encoder: Encoder;
  signature: string;
  digest: string;
  userAddress?: string;
  name?: string;
};

export type SignInResponse = {
  accessToken: string;
  address: string;
  avatar: string;
  user_id: string;
  workspace: Workspace;
  id: string;
  notify: boolean;
  rootWallet: string;
  first_login: boolean;
  webAuthn?: {
    id: string;
    publicKey: string;
  };
  provider: string;
};

export type GetByHardwareResponse = {
  name: string;
};

export type GetByNameResponse = {
  webAuthnId?: string;
};

export type CheckNicknameResponse = {
  type: TypeUser;
};

export type AuthenticateParams = {
  userId: string;
  avatar: string;
  account: string;
  accountType: TypeUser;
  accessToken: string;
  permissions: IPermission;
  singleWorkspace: string;
  webAuthn?: Omit<SignWebAuthnPayload, "challenge">;
  provider_url: string;
  first_login?: boolean;
};

export type AuthenticateWorkspaceParams = {
  permissions: IPermission;
  workspace: string;
};

export interface IUserInfos extends IGetUserInfosResponse {
  isLoading: boolean;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<IGetUserInfosResponse, Error>>;
  singleWorkspaceId: string;
}

export type IUseAuthDetails = {
  userProvider: () => Promise<{
    provider: Provider;
  }>;
  invalidAccount: boolean;
  handlers: {
    logout: (
      removeTokenFromDb?: boolean,
      callback?: () => void,
    ) => Promise<void>;
    logoutWhenExpired: () => void;
    authenticate: (params: AuthenticateParams) => void;
    setInvalidAccount: React.Dispatch<React.SetStateAction<boolean>>;
    isTokenExpired: boolean;
    setIsTokenExpired: React.Dispatch<React.SetStateAction<boolean>>;
  };
  userInfos: IUserInfos;
};

export type UserType = {
  type: TypeUser;
  name: EConnectors;
};

export type IGetUserInfosResponse = {
  address: string;
  avatar: string;
  id: string;
  name: string;
  onSingleWorkspace: boolean;
  type: UserType;
  webauthn: SignWebAuthnPayload;
  first_login?: boolean;
  workspace: {
    avatar: string;
    id: string;
    name: string;
    permission: IPermission;
    description: string;
  };
  network: Network;
};
// export const localStorageKeys = {
//   HARDWARE_ID: "bakosafe/hardwareId",
//   WEB_AUTHN_LAST_LOGIN_USERNAME: "bakosafe/web-authn-last-login-username",
//   NETWORKS: "bakosafe/networks/list",
//   SELECTED_CHAIN_ID: "bakosafe/selected-chain-id",
//   SELECTED_NETWORK: "bakosafe/selected-network",
// };

// export const UserQueryKey = {
//   DEFAULT: "user",
//   HARDWARE_ID: () => [UserQueryKey.DEFAULT, "hardware-id"],
//   CREATE_HARDWARE_ID: () => [UserQueryKey.DEFAULT, "create-hardware-id"],
//   CREATE_WEB_AUTHN_ACCOUNT: () => [
//     UserQueryKey.DEFAULT,
//     "create-web-authn-account",
//   ],
//   SIGN_MESSAGE_WEB_AUTHN: () => [
//     UserQueryKey.DEFAULT,
//     "sign-message-web-authn",
//   ],
//   // HARDWARE_ID: () => [UserQueryKey.DEFAULT, 'hardware-id'],
//   ACCOUNTS: (hardwareId: string) => [
//     UserQueryKey.DEFAULT,
//     "accounts",
//     hardwareId,
//   ],
//   NICKNAME: (search: string, userId?: string) => [
//     UserQueryKey.DEFAULT,
//     "nickname",
//     search,
//     userId,
//   ],
//   FULL_DATA: (search: string, hardwareId: string) => [
//     UserQueryKey.DEFAULT,
//     UserQueryKey.NICKNAME(search),
//     // UserQueryKey.HARDWARE_ID(),
//     UserQueryKey.ACCOUNTS(hardwareId),
//   ],
// };
