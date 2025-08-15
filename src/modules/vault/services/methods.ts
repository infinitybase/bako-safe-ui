import { BN, bn, CoinQuantity } from 'fuels';

import { api } from '@/config';
import { Asset, NFT } from '@/modules/core';
import { IPredicate } from '@/modules/core/hooks/bakosafe/utils/types';
import { Predicate, Workspace } from '@/modules/core/models';
import { IPagination, PaginationParams } from '@/modules/core/utils/pagination';
import { SortOption } from '@/modules/transactions/services';

export interface GetAllPredicatesPayload extends PaginationParams {
  q?: string;
  address?: string;
  signer?: string;
  provider?: string;
  owner?: string;
  orderBy?: string;
  sort?: SortOption;
  orderByRoot?: boolean;
  hidden?: boolean;
}

export interface HasReservedCoins {
  currentBalanceUSD: string;
  reservedCoins: CoinQuantity[];
  currentBalance: Required<Asset>[];
  nfts: NFT[];
}

export type PredicateWorkspace = Omit<Workspace, 'permissions'>;
export type PredicateAndWorkspace = Predicate & {
  workspace: PredicateWorkspace;
  isHidden?: boolean;
};
export type PredicateResponseWithWorkspace = IPredicate & {
  workspace: Workspace;
};
export type GetHasReservedCoins = HasReservedCoins;
export type CreatePredicateResponse = Predicate;
export type GetAllPredicateResponse = PredicateAndWorkspace[];
export type GetAllPredicatePaginationResponse =
  IPagination<PredicateAndWorkspace>;
export type CreatePredicatePayload = Omit<
  Predicate,
  'id' | 'transactions' | 'completeAddress' | 'owner'
>;

export class VaultService {
  static async create(payload: CreatePredicatePayload) {
    const { data } = await api.post<CreatePredicateResponse>(
      '/predicate',
      payload,
    );
    return data;
  }

  static async getAllWithPagination(params: GetAllPredicatesPayload) {
    const { data } = await api.get<GetAllPredicatePaginationResponse>(
      '/predicate',
      {
        params,
      },
    );

    return data;
  }

  static async toggleVisibility(address: string) {
    const { data } = await api.put(`/predicate/${address}/visibility`);
    return data;
  }

  static async getById(id: string) {
    const { data } = await api.get<PredicateResponseWithWorkspace>(
      `/predicate/${id}`,
    );
    return data;
  }

  static async getByAddress(address: string) {
    const { data } = await api.get<PredicateResponseWithWorkspace>(
      `/predicate/by-address/${address}`,
    );
    return data;
  }

  static async getByName(name: string) {
    const { data } = await api.get<boolean>(`/predicate/by-name/${name}`);
    return data;
  }

  static async checkByAddress(address: string) {
    const { data } = await api.get<boolean>(
      `/predicate/check/by-address/${address}`,
    );
    return data;
  }

  static async findPredicates(address: string) {
    const { data } = await api.get<GetAllPredicateResponse>(`/predicate`, {
      data: {
        signer: address,
      },
    });
    return data;
  }

  static async hasReservedCoins(
    predicateId: string,
  ): Promise<HasReservedCoins> {
    const { data } = await api.get<HasReservedCoins>(
      `/predicate/reserved-coins/${predicateId}`,
    );

    console.log('>>> DATA HAS RESERVED COINS', data);

    data.currentBalance.forEach((item) => {
      console.log('>>> AMOUNT RESERVE', bn(item.amount).toString());
    });

    return {
      ...data,
      reservedCoins: data.reservedCoins.map((reservedCoin) => ({
        ...reservedCoin,
        amount: new BN(reservedCoin.amount),
      })),
    };
  }
}
