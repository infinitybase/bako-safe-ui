import { api } from '@/config';
import { IPagination, Predicate, Workspace } from '@/modules/core';
import { AssetId } from '@/modules/core/utils/assets/address';
import { TransactionWithVault } from '@/modules/transactions/services';

import { TransactionType } from 'bakosafe';

export interface HomeDataResponse {
  predicates: IPagination<Predicate & { workspace: Workspace }>;
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
