import {
  CreateAPITokenParams,
  CreateAPITokenPayload,
  CreateAPITokenResponse,
  DeleteAPITokenParams,
  GetAPITokensParams,
  GetAPITokensResponse,
} from "./types";
import { AxiosInstance } from "axios";

export class APITokenService {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async create(params: CreateAPITokenParams, payload: CreateAPITokenPayload) {
    const { data } = await this.api.post<CreateAPITokenResponse>(
      `/api-token/${params.predicateId}`,
      payload,
    );
    return data;
  }

  async getAll(params: GetAPITokensParams) {
    const { data } = await this.api.get<GetAPITokensResponse>(
      `/api-token/${params.predicateId}`,
    );
    return data;
  }

  async delete(params: DeleteAPITokenParams) {
    const { data } = await this.api.delete<void>(
      `/api-token/${params.predicateId}/${params.apiTokenId}`,
    );
    return data;
  }
}
