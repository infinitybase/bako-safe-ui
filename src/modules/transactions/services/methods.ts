import { ITransactionResume } from 'bakosafe';
import { Provider } from 'fuels';
import { clone } from 'ramda';

import { api } from '@/config/api';

import {
  CancelTransactionResponse,
  CloseTransactionPayload,
  CreateTransactionPayload,
  CreateTransactionResponse,
  GetTransactionHistoryResponse,
  GetTransactionParams,
  GetTransactionPendingResponse,
  GetTransactionResponse,
  GetTransactionsPaginationResponse,
  GetTransactionsWithIncomingsPaginationResponse,
  GetTransactionsWithIncomingsParams,
  GetUserTransactionsParams,
  GetUserTransactionsResponse,
  GetVaultTransactionsParams,
  GetVaultTransactionsResponse,
  ITransactionStatusFilter,
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
  static async getByHash(hash: string, status?: ITransactionStatusFilter) {
    const { data } = await api.get<GetTransactionResponse>(
      `/transaction/by-hash/0x${hash}`,
      {
        params: {
          status,
        },
      },
    );
    return data;
  }

  static async signer(payload: SignerTransactionPayload) {
    const { hash, ...body } = payload;
    const { data } = await api.put<SignerTransactionResponse>(
      `/transaction/sign/${hash}`,
      {
        signature: body.signer,
        approve: !!body.confirm,
      },
    );
    return data;
  }

  static async cancel(hash: string) {
    const { data } = await api.put<CancelTransactionResponse>(
      `/transaction/cancel/${hash}`,
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

  static async getTransactionsWithIncomingsPagination(
    params: GetTransactionsWithIncomingsParams,
  ) {
    const { data } =
      await api.get<GetTransactionsWithIncomingsPaginationResponse>(
        `/transaction/with-incomings`,
        {
          params: { ...params },
        },
      );
    return data;
  }

  static async send(BakoSafeTransactionId: string) {
    const { data } = await api.post(
      `/transaction/send/${BakoSafeTransactionId}`,
    );

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
    const { vault: _vault, assets } = input;
    const vault = clone(_vault);
    vault.provider = new Provider(vault.provider.url);
    console.log('assets:', assets);
    const { tx } = await vault.transaction({ assets });
    console.log('tx.inputs:', tx.inputs);
    return {
      fee: tx.maxFee,
    };
  }

  static async getTransactionsHistory(id: string, predicateId: string) {
    const { data } = await api.get<GetTransactionHistoryResponse>(
      `/transaction/history/${id}/${predicateId}`,
    );
    return data;
  }

  static async verifyOnChain(id: string) {
    const { data } = await api.get<ITransactionResume>(
      `/transaction/verify/${id}`,
    );
    return data;
  }
}
