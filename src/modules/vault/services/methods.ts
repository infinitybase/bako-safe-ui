import { api } from '@/config';

export interface Predicate {
  name: string;
  address: string;
  description?: string;
  minSigners: number;
  addresses: string[];
  owner: string;
  bytes: string;
  abi: string;
  configurable: string;
  network: string;
  _id: string;
}

export type GetPredicateResponse = Predicate;
export type CreatePredicateResponse = Predicate;
export type GetAllPredicateResponse = Predicate[];
export type CreatePredicatePayload = Omit<Predicate, '_id'>;

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
