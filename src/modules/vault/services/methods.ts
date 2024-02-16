import { BN } from 'fuels';

import { api } from '@/config';
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
}

export type PredicateAndWorkspace = Predicate & { workspace: Workspace };

export type GetPredicateResponse = Predicate;
export type CreatePredicateResponse = Predicate;
export type GetAllPredicateResponse = PredicateAndWorkspace[];
export type GetAllPredicatePaginationResponse = IPagination<
  Predicate & {
    workspace: Workspace;
  }
>;
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

  static async getAll() {
    const { data } = await api.get<GetAllPredicateResponse>('/predicate');

    return data;
  }

  static async getById(id: string) {
    const { data } = await api.get<GetPredicateResponse>(`/predicate/${id}`);
    return data;
  }

  static async getByAddress(address: string) {
    const { data } = await api.get<GetPredicateResponse>(
      `/predicate/by-address/${address}`,
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

  static async hasReservedCoins(predicate: string) {
    const { data } = await api.get<string>(
      `/predicate/reserved-coins/${predicate}`,
    );

    return new BN(data);
  }
}
