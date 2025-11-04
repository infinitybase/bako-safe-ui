import { bytesToHex } from '@noble/curves/abstract/utils';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Address, Network, Provider } from 'fuels';

import { api } from '@/config';
import { IPermission, Workspace } from '@/modules/core';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { createAccount, signChallange } from '@/modules/core/utils/webauthn';

export enum Encoder {
  FUEL = 'FUEL',
  METAMASK = 'METAMASK',
  WEB_AUTHN = 'WEB_AUTHN',
  EVM = 'EVM',
}

export enum TypeUser {
  FUEL = 'FUEL',
  FULLET = 'FULLET',
  WEB_AUTHN = 'WEB_AUTHN',
  EVM = 'EVM',
  SOCIAL = 'SOCIAL',
}

export type SignWebAuthnPayload = {
  id: string;
  challenge: string;
  publicKey: string;
};

export type SignMessageWebAuthnPayload = {
  signPayload: SignWebAuthnPayload;
  address: string;
  predicateVersion?: string;
};

export type SignInSignWebAuthnPayload = Omit<
  SignWebAuthnPayload,
  'publicKey'
> & {
  name: string;
};

export type WalletSignMessagePayload = {
  message: string;
  predicateVersion?: string;
};

export type CreateUserResponse = {
  id: string;
  code: string;
  type: TypeUser;
};

export type UseSignInRequestParams = {
  code: string;
  type: TypeUser;
  encoder?: Encoder;
  account?: string;
  signature?: string;
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
  userAddress?: string | null;
  name?: string;
};

export type UserSettings = {
  inactivesPredicates: string[];
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
  settings?: UserSettings;
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
  webAuthn?: Omit<SignWebAuthnPayload, 'challenge'>;
  provider_url: string;
  first_login?: boolean;
  settings?: UserSettings;
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

export type IUseAuthReturn = {
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
  settings: UserSettings;
  workspace: {
    avatar: string;
    id: string;
    name: string;
    permission: IPermission;
    description: string;
  };
  network: Network;
};

interface IGetUserWalletResponse {
  address: string;
  configurable: string;
  version: string;
}

export class UserService {
  static async create(payload: CreateUserPayload) {
    // const invalidNetwork = payload?.provider?.includes(NetworkType.MAINNET);

    // if (invalidNetwork) {
    //   throw new Error('You cannot access using mainnet network.');
    // }

    const { data } = await api.post<CreateUserResponse>('/user', payload);
    return data;
  }

  static async signIn(payload: SignInPayload) {
    const { data, status } = await api.post<SignInResponse>(
      '/auth/sign-in',
      payload,
    );

    //any status diferent from 200 is invalid signature
    if (status !== 200) {
      throw new Error('Invalid signature');
    }

    return data;
  }

  static async signOut() {
    const { data } = await api.delete<void>('/auth/sign-out');
    return data;
  }

  static async getUserInfos() {
    const { data } = await api.get<IGetUserInfosResponse>('/user/latest/info');

    return data;
  }

  static async getByName(name: string) {
    const { data } = await api.get<GetByNameResponse>(`/user/by-name/${name}`);

    return data;
  }

  static async verifyNickname(nickname: string, userId?: string) {
    if (!nickname) return;
    const { data } = await api.get<CheckNicknameResponse>(
      `/user/nickname/${nickname}`,
      {
        params: { userId },
      },
    );

    return data;
  }

  static async getByHardwareId(hardwareId: string) {
    const { data } = await api.get<GetByHardwareResponse[]>(
      `/user/by-hardware/${hardwareId}`,
    );
    return data;
  }

  static async userWallet() {
    const { data } = await api.get<IGetUserWalletResponse>('/user/wallet');
    return data;
  }

  static async createWebAuthnAccount(name: string) {
    const account = await createAccount(name, Address.fromRandom().toB256());

    const payload = {
      name,
      address: Address.fromB256(account.address).toString(),
      provider: import.meta.env.VITE_NETWORK,
      type: TypeUser.WEB_AUTHN,
      webauthn: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        id: account.credential?.id!,
        publicKey: account.publicKeyHex,
        origin: window.location.origin,
        hardware: localStorage.getItem(localStorageKeys.HARDWARE_ID)!,
      },
    };
    return {
      ...(await UserService.create(payload)),
      id: payload.webauthn.id,
      publicKey: payload.webauthn.publicKey,
    };
  }

  static async signMessageWebAuthn({
    id,
    challenge,
    name,
  }: SignInSignWebAuthnPayload) {
    const signature = await signChallange(id, challenge);

    return await UserService.signIn({
      encoder: Encoder.WEB_AUTHN,
      signature: bytesToHex(signature!.sig_compact),
      digest: bytesToHex(signature!.dig_compact),
      name,
    });
  }

  static async generateSignInCode(name: string, networkUrl?: string) {
    const { data } = await api.post<CreateUserResponse>(`/auth/code`, {
      name,
      networkUrl,
    });
    return data;
  }
}

export const localStorageKeys = {
  HARDWARE_ID: 'bakosafe/hardwareId',
  WEB_AUTHN_LAST_LOGIN_USERNAME: 'bakosafe/web-authn-last-login-username',
  NETWORKS: 'bakosafe/networks/list',
  SELECTED_CHAIN_ID: 'bakosafe/selected-chain-id',
  SELECTED_NETWORK: 'bakosafe/selected-network',
  FUEL_MAPPED_TOKENS: 'bakosafe/fuel-mapped-tokens',
  FUEL_MAPPED_ASSETS: 'bakosafe/fuel-mapped-assets',
  FUEL_MAPPED_NFTS: 'bakosafe/fuel-mapped-nfts',
  USERNAMES: 'bakosafe/usernames',
};

export const UserQueryKey = {
  DEFAULT: 'user',
  HARDWARE_ID: () => [UserQueryKey.DEFAULT, 'hardware-id'],
  CREATE_HARDWARE_ID: () => [UserQueryKey.DEFAULT, 'create-hardware-id'],
  CREATE_WEB_AUTHN_ACCOUNT: () => [
    UserQueryKey.DEFAULT,
    'create-web-authn-account',
  ],
  SIGN_MESSAGE_WEB_AUTHN: () => [
    UserQueryKey.DEFAULT,
    'sign-message-web-authn',
  ],
  // HARDWARE_ID: () => [UserQueryKey.DEFAULT, 'hardware-id'],
  ACCOUNTS: (hardwareId: string) => [
    UserQueryKey.DEFAULT,
    'accounts',
    hardwareId,
  ],
  NICKNAME: (search: string, userId?: string) => [
    UserQueryKey.DEFAULT,
    'nickname',
    search,
    userId,
  ],
  FULL_DATA: (search: string, hardwareId: string) => [
    UserQueryKey.DEFAULT,
    UserQueryKey.NICKNAME(search),
    // UserQueryKey.HARDWARE_ID(),
    UserQueryKey.ACCOUNTS(hardwareId),
  ],
};
