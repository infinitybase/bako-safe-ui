import {
  type CheckNicknameResponse,
  type CreateUserPayload,
  type CreateUserResponse,
  Encoder,
  type GetByHardwareResponse,
  type GetByNameResponse,
  type IGetUserInfosResponse,
  NetworkType,
  type SignInPayload,
  type SignInResponse,
  type SignInSignWebAuthnPayload,
} from "../../types";
import { TypeUser, createAccount } from "bakosafe";
import { Address } from "fuels";

import type { AxiosInstance } from "axios";
import { bindMethods } from "@/utils";

export class UserService {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;

    bindMethods(this);
  }
  async create(payload: CreateUserPayload) {
    const invalidNetwork = payload?.provider?.includes(NetworkType.MAINNET);

    if (invalidNetwork) {
      throw new Error("You cannot access using mainnet network.");
    }

    const { data } = await this.api.post<CreateUserResponse>("/user", payload);
    return data;
  }

  async signIn(payload: SignInPayload) {
    const { data, status } = await this.api.post<SignInResponse>(
      "/auth/sign-in",
      payload,
    );

    //any status diferent from 200 is invalid signature
    if (status !== 200) {
      throw new Error("Invalid signature");
    }

    return data;
  }

  async signOut() {
    const { data } = await this.api.delete<void>("/auth/sign-out");
    return data;
  }

  async getUserInfos() {
    const { data } =
      await this.api.get<IGetUserInfosResponse>("/user/latest/info");

    return data;
  }

  async getByName(name: string) {
    const { data } = await this.api.get<GetByNameResponse>(
      `/user/by-name/${name}`,
    );

    return data;
  }

  async verifyNickname(nickname: string, userId?: string) {
    if (!nickname) return;
    const { data } = await this.api.get<CheckNicknameResponse>(
      `/user/nickname/${nickname}`,
      {
        params: { userId },
      },
    );

    return data;
  }

  async getByHardwareId(hardwareId: string) {
    const { data } = await this.api.get<GetByHardwareResponse[]>(
      `/user/by-hardware/${hardwareId}`,
    );
    return data;
  }

  async createWebAuthnAccount(name: string) {
    const account = await createAccount(name, Address.fromRandom().toB256());

    const payload = {
      name,
      address: Address.fromB256(account.address).toString(),
      // todo: make this param dynamic
      provider: "https://testnet.fuel.network/v1/graphql",
      type: TypeUser.WEB_AUTHN,
      webauthn: {
        id: account.credential?.id ?? "",
        publicKey: account.publicKeyHex,
        origin: "random_origin", //window.location.origin,
        // todo: we need recive this param, this repo can used on node, and this param is not available because is a browser param
        hardware: "random_hardware_id", //localStorage.getItem(localStorageKeys.HARDWARE_ID)!,
      },
    };
    return {
      ...(await this.create(payload)),
      id: payload.webauthn.id,
      publicKey: payload.webauthn.publicKey,
    };
  }

  async signMessageWebAuthn({
    id,
    challenge,
    name,
  }: SignInSignWebAuthnPayload) {
    // const signature = await signChallange(id, challenge);

    return await this.signIn({
      encoder: Encoder.WEB_AUTHN,
      signature: "bytesToHex(signature.sig_compact)",
      digest: "bytesToHex(signature.dig_compact)",
      name,
    });
  }

  async generateSignInCode(name: string, networkUrl?: string) {
    const { data } = await this.api.post<CreateUserResponse>("/auth/code", {
      name,
      networkUrl,
    });
    return data;
  }
}
