import { api } from '@/config';

export enum Encoder {
  FUEL = 'fuel',
  METAMASK = 'metamask',
}

export type CreateUserResponse = {
  id: string;
  address: string;
  provider: string;
  avatar: string;
};

export type CreateUserPayload = {
  address: string;
  provider: string;
};

export type SignInPayload = {
  address: string;
  hash: string;
  createdAt: string;
  encoder: Encoder;
  provider: string;
  user_id: string;
  signature: string;
};

export type SignInResponse = {
  accessToken: string;
  avatar: string;
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
