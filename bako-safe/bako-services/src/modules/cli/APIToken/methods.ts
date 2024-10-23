import { api } from "@app/config";

import {
  CreateAPITokenParams,
  CreateAPITokenPayload,
  CreateAPITokenResponse,
  DeleteAPITokenParams,
  GetAPITokensParams,
  GetAPITokensResponse,
} from "./types";

export class APITokenService {
  static async create(
    params: CreateAPITokenParams,
    payload: CreateAPITokenPayload,
  ) {
    const { data } = await api.post<CreateAPITokenResponse>(
      `/api-token/${params.predicateId}`,
      payload,
    );
    return data;
  }

  static async getAll(params: GetAPITokensParams) {
    const { data } = await api.get<GetAPITokensResponse>(
      `/api-token/${params.predicateId}`,
    );
    return data;
  }

  static async delete(params: DeleteAPITokenParams) {
    const { data } = await api.delete<void>(
      `/api-token/${params.predicateId}/${params.apiTokenId}`,
    );
    return data;
  }
}
