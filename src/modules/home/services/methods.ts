import { TransactionType } from 'bakosafe';

import { api } from '@/config';
import { IPredicateAllocation } from '@/modules/core';
import { AssetId } from '@/modules/core/utils/assets/address';
import {
  ITransactionStatusFilter,
  TransactionWithVault,
} from '@/modules/transactions/services';
import { GetAllPredicatePaginationResponse } from '@/modules/vault';

export interface HomeDataResponse {
  predicates: GetAllPredicatePaginationResponse;
}

export interface HomeTransactionsResponse {
  data: TransactionWithVault[];
  offsetDb: number;
  offsetFuel: number;
  perPage: number;
}

type TokensUSDResponse = [AssetId, number][];

type HomeTransactionsParams = {
  type?: TransactionType;
  status?: ITransactionStatusFilter;
  offsetDb?: string | number;
  offsetFuel?: string | number;
  perPage?: string | number;
};

export class HomeService {
  static async home() {
    const { data } = await api.get<HomeDataResponse>(`/user/predicates`);

    return data;
  }

  static async homeTransactions(params: HomeTransactionsParams) {
    const { data } = await api.get<HomeTransactionsResponse>(
      `/user/transactions`,
      {
        params: { ...params },
      },
    );

    return data;
  }

  static async getTokensUSDAmount() {
    const { data } = await api.get<TokensUSDResponse>(`/user/latest/tokens`);

    const result = !Array.isArray(data) ? [] : data;

    return result;
  }

  static async getUserAllocation() {
    const { data } = await api.get<IPredicateAllocation>(`/user/allocation`);

    return data;
  }

  static async checkUserBalances() {
    const { data } = await api.get<null>(`/user/check-balances`);

    return data;
  }
}
