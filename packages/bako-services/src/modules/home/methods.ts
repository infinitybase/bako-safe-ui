import { TransactionType } from "bakosafe";

import { AssetId } from "@/types";
import { TransactionWithVault } from "../transaction";
import { GetAllPredicatePaginationResponse } from "../vault";
import { api } from "@/config";

export interface HomeDataResponse {
  predicates: GetAllPredicatePaginationResponse;
}

export interface HomeTransactionsResponse {
  data: TransactionWithVault[];
}

type TokensUSDResponse = [AssetId, number][];
export class HomeService {
  static async home() {
    const { data } = await api.get<HomeDataResponse>(`/user/predicates`);

    return data;
  }

  static async homeTransactions(type?: TransactionType) {
    const { data } = await api.get<HomeTransactionsResponse>(
      `/user/latest/transactions`,
      {
        params: {
          type,
        },
      },
    );

    return data;
  }

  static async getTokensUSDAmount() {
    const { data } = await api.get<TokensUSDResponse>(`/user/latest/tokens`);

    return data;
  }
}
