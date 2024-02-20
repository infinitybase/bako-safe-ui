import { api } from '@/config';
import { IPagination, Predicate, Workspace } from '@/modules/core';
import { TransactionWithVault } from '@/modules/transactions/services';

export interface HomeDataResponse {
  predicates: IPagination<Predicate & { workspace: Workspace }>;
  transactions: IPagination<TransactionWithVault>;
  workspace: Workspace;
}

export class HomeService {
  static async home() {
    const { data } = await api.get<HomeDataResponse>(`/user/me`);

    return data;
  }
}
