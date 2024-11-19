import type { TransactionType } from "bakosafe";

import type { AssetId } from "@/types";
import type { TransactionWithVault } from "../transaction";
import type { GetAllPredicatePaginationResponse } from "../vault";
import type { AxiosInstance } from "axios";

export interface HomeDataResponse {
  predicates: GetAllPredicatePaginationResponse;
}

export interface HomeTransactionsResponse {
  data: TransactionWithVault[];
}

type TokensUSDResponse = [AssetId, number][];
export class HomeService {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async home() {
    const { data } = await this.api.get<HomeDataResponse>("/user/predicates");

    return data;
  }

  async homeTransactions(type?: TransactionType) {
    const { data } = await this.api.get<HomeTransactionsResponse>(
      "/user/latest/transactions",
      {
        params: {
          type,
        },
      },
    );

    return data;
  }

  async getTokensUSDAmount() {
    const { data } = await this.api.get<TokensUSDResponse>(
      "/user/latest/tokens",
    );

    return data;
  }
}
