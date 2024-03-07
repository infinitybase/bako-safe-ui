import { Transfer } from 'bsafe';

import { api } from '@/config/api';

import {
  CloseTransactionPayload,
  CreateTransactionPayload,
  CreateTransactionResponse,
  GetTransactionParams,
  GetTransactionPendingResponse,
  GetTransactionResponse,
  GetTransactionsPaginationResponse,
  GetTransactionsResponse,
  GetUserTransactionsParams,
  GetUserTransactionsResponse,
  GetVaultTransactionsParams,
  GetVaultTransactionsResponse,
  ResolveTransactionCostInput,
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
  static async getByHash(hash: string) {
    const { data } = await api.get<GetTransactionResponse>(
      `/transaction/by-hash/${hash}`,
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
    const { data } = await api.get<GetTransactionsResponse>(`/transaction`, {
      params: { ...params },
    });
    return data;
  }

  static async getTransactionsPagination(params: GetTransactionParams) {
    const { data } = await api.get<GetTransactionsPaginationResponse>(
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

  static async send(BSAFETransactionId: string) {
    const { data } = await api.post(`/transaction/send/${BSAFETransactionId}`);

    return data;
  }

  static async getVaultTransactions(params: GetVaultTransactionsParams) {
    const { data } = await api.get<GetVaultTransactionsResponse>(
      `/transaction`,
      {
        params: { ...params },
      },
    );
    return data;
  }

  static async getTransactionsSignaturePending(predicateId?: string[]) {
    const { data } = await api.get<GetTransactionPendingResponse>(
      `/transaction/pending`,
      {
        params: { predicateId },
      },
    );
    return data;
  }

  static async resolveTransactionCosts(input: ResolveTransactionCostInput) {
    const { vault, assets } = input;

    const { transactionRequest } = await Transfer.instance({
      vault,
      transfer: {
        name: '',
        assets,
        witnesses: [],
      },
    });

    const { gasPrice, usedFee, minFee } =
      await vault.provider.getTransactionCost(transactionRequest);

    transactionRequest.gasPrice = gasPrice;

    return {
      fee: usedFee.add(minFee),
      transactionRequest,
    };
  }
}
