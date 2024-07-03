import { api } from '@/config';
import { IPagination, Predicate, Workspace } from '@/modules/core';
import { AssetId } from '@/modules/core/utils/assets/address';
import {
  ITransactionsGroupedByMonth,
  TransactionType,
} from '@/modules/transactions/services';

export interface HomeDataResponse {
  predicates: IPagination<Predicate & { workspace: Workspace }>;
  workspace: Workspace;
}

export interface HomeTransactionsResponse {
  data: IPagination<ITransactionsGroupedByMonth>;
}

type TokensUSDResponse = [AssetId, number][];
export class HomeService {
  static async home() {
    const { data } = await api.get<HomeDataResponse>(`/user/me`);

    return data;
  }

  static async homeTransactions(type: TransactionType | undefined) {
    const { data } = await api.get<HomeTransactionsResponse>(
      `/user/me/transactions`,
      {
        params: {
          type,
        },
      },
    );

    return data;
  }

  static async getTokensUSDAmount() {
    const { data } = await api.get<TokensUSDResponse>(`/user/me/tokens`);

    return data;
  }
}
