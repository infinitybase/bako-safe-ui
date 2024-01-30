import { api } from '@/config';
import { IPagination, Predicate } from '@/modules/core';
import { TransactionWithVault } from '@/modules/transactions/services';

export interface HomeDataResponse {
  predicates: IPagination<Predicate>;
  transactions: IPagination<TransactionWithVault>;
}

export class HomeService {
  static async home() {
    const { data } = await api.get<HomeDataResponse>(`/user/me`);

    return data;
  }
}
