import { api } from '@/config';

export interface Predicate {
  id: number;
  name: string;
  predicateAddress: string;
  description: string;
  minSigners: number;
  addresses: string[];
  owner: string;
  bytes: string;
  abi: string;
  configurable: string;
  network: string;
  chainId?: number;
}

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

  static async findByAddresses(address: string) {
    const { data } = await api.get<GetAllPredicateResponse>(
      `/predicate/by-addresses/${address}`,
    );
    return data;
  }
}
