import { api } from '@/config/api';

import {
  CloseSender,
  CreateTransactionPayload,
  CreateTransactionResponse,
  GetAllTransactionResponse,
  GetTransactionByAddressesResponse,
  GetTransactionByPredicateIdResponse,
  GetTransactionResponse,
  SignerTransactionPayload,
  SignerTransactionResponse,
} from './types';

export class TransactionService {
  static async create(payload: CreateTransactionPayload) {
    const { data } = await api.post<CreateTransactionResponse>(
      '/transactions',
      payload,
    );
    return data;
  }
  static async getAll() {
    const { data } = await api.get<GetAllTransactionResponse>('/transactions');
    return data;
  }
  static async getById(id: string) {
    const { data } = await api.get<GetTransactionResponse>(
      `/transactions/${id}`,
    );
    return data;
  }
  static async signer(id: string, payload: SignerTransactionPayload) {
    const { data } = await api.put<SignerTransactionResponse>(
      `/transactions/signer/${id}`,
      payload,
    );
    return data;
  }
  static async getByVault(predicateId: string) {
    const { data } = await api.get<GetTransactionByPredicateIdResponse>(
      `/transactions/predicate/${predicateId}`,
    );
    return data;
  }

  async getByDestiny(address: string) {
    const { data } = await api.get<GetTransactionByPredicateIdResponse>(
      `/transactions/predicate/${address}`,
    );
    return data;
  }

  static async done(id: string, payload: CloseSender) {
    const { data } = await api.put<GetTransactionResponse>(
      `/transactions/close/${id}`,
      payload,
    );
    return data;
  }

  static async getByAddress(address: string) {
    const { data } = await api.get<GetTransactionByAddressesResponse>(
      `transactions/by-address/${address}`,
    );
    return data;
  }
}
