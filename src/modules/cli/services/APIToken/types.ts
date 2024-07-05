export interface APITokenConfig {
  transactionTitle: string;
}

export interface APIToken {
  id: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
  name: string;
  config?: APITokenConfig;
}

export interface CreateAPITokenParams {
  predicateId: string;
}

export interface CreateAPITokenPayload {
  name: string;
  config?: APITokenConfig;
}

export interface CreateAPITokenResponse {
  id: string;
  name: string;
  token: string;
  config?: APITokenConfig;
}

export type GetAPITokensParams = CreateAPITokenParams;

export type GetAPITokensResponse = APIToken[];

export interface DeleteAPITokenParams extends GetAPITokensParams {
  apiTokenId: string;
}
