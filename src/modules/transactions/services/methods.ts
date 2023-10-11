import { api } from '@/config/api';

import {
  CloseTransactionPayload,
  CreateTransactionPayload,
  CreateTransactionResponse,
  GetTransactionByAddressesResponse,
  GetTransactionParams,
  GetTransactionResponse,
  GetUserTransactionsParams,
  GetUserTransactionsResponse,
  SignerTransactionPayload,
  SignerTransactionResponse,
} from './types';

export class TransactionService {
  static async create(payload: CreateTransactionPayload) {
    const { data } = await api.post<CreateTransactionResponse>(
      '/transaction',
      payload,
    );
    return data;
  }

  static async getById(id: string) {
    const { data } = await api.get<GetTransactionResponse>(
      `/transaction/${id}`,
    );
    return data;
  }

  static async signer(payload: SignerTransactionPayload) {
    const { id, ...body } = payload;
    const { data } = await api.put<SignerTransactionResponse>(
      `/transaction/signer/${id}`,
      body,
    );
    return data;
  }

  static async close(id: string, payload: CloseTransactionPayload) {
    const { data } = await api.put<GetTransactionResponse>(
      `/transaction/close/${id}`,
      payload,
    );
    return data;
  }

  static async getTransactions(params: GetTransactionParams) {
    const { data } = await api.get<GetTransactionByAddressesResponse>(
      `/transaction`,
      {
        params: { ...params },
      },
    );
    return data;
  }

  static async getUserTransactions(params: GetUserTransactionsParams) {
    const { data } = await api.get<GetUserTransactionsResponse>(
      `/transaction`,
      {
        params: { ...params },
      },
    );
    return data;
  }
}
