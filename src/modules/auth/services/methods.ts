import { api } from '@/config';
import { Workspace } from '@/modules/core';

export enum Encoder {
  FUEL = 'FUEL',
  METAMASK = 'METAMASK',
  WEB_AUTHN = 'WEB_AUTHN',
}

export enum TypeUser {
  FUEL = 'FUEL',
  WEB_AUTHN = 'WEB_AUTHN',
}

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
};

export type SignInResponse = {
  accessToken: string;
  avatar: string;
  user_id: string;
  workspace: Workspace;
  id: string;
  notify: boolean;
  firstLogin: boolean;
};

export class UserService {
  static async create(payload: CreateUserPayload) {
    const response = await api.post<CreateUserResponse>('/user', payload);
    return response?.data;
  }

  static async signIn(payload: SignInPayload) {
    const response = await api.post<SignInResponse>('/auth/sign-in', payload);
    return response?.data;
  }
}
