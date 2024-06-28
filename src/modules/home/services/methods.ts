import { api } from '@/config';
import { IPagination, Predicate, Workspace } from '@/modules/core';
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
}
