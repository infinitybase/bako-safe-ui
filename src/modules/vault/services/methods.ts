import { api } from '@/config';
import { Predicate } from '@/modules/core';

export type GetPredicateResponse = Predicate;
export type CreatePredicateResponse = Predicate;
export type GetAllPredicateResponse = Predicate[];
export type CreatePredicatePayload = Omit<Predicate, 'id'>;

export class VaultService {
  static async create(payload: CreatePredicatePayload) {
    const { data } = await api.post<CreatePredicateResponse>(
      '/predicate',
      payload,
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
}
