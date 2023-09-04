import { api } from '@/config';

import {
  CreatePredicatePayload,
  CreatePredicateResponse,
  GetAllPredicateResponse,
  GetPredicateResponse,
} from './types.ts';

export class VaultService {
  static async create(payload: CreatePredicatePayload) {
    const { data } = await api.post<CreatePredicateResponse>(
      '/predicates',
      payload,
    );
    return data;
  }
  static async getAll() {
    const { data } = await api.get<GetAllPredicateResponse>('/predicates');
    return data;
  }
  static async getById(id: string) {
    const { data } = await api.get<GetPredicateResponse>(`/predicates/${id}`);
    return data;
  }
  static async findByAddresses(address: string) {
    const { data } = await api.get<GetAllPredicateResponse>(
      `/predicates/by-addresses/${address}`,
    );
    return data;
  }
}
