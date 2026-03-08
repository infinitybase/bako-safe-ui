import { api } from '@/config';
import { IPagination } from '@/modules/core/hooks/bakosafe/utils/types';
import { queryfy } from '@/utils';

import {
  GetTransactionParams,
  ITransactionResume,
  TransactionWithVault,
} from './types';

const TransactionService = {
  async getTransactionsPagination(
    params: GetTransactionParams,
  ): Promise<IPagination<TransactionWithVault>> {
    const queryParams = {
      ...params,
      dateFrom: params.dateFrom?.toISOString(),
      dateTo: params.dateTo?.toISOString(),
    };
    
    const { data } = await api.get(
      `/transaction?${queryfy(queryParams)}`,
    );
    return data;
  },

  async getByHash(hash: string, status?: string[]) {
    const { data } = await api.get(
      `/transaction/by-hash/${hash}?${queryfy({ status })}`,
    );
    return data;
  },

  async getTransactionResume(
    transactionId: string,
  ): Promise<ITransactionResume> {
    const { data } = await api.get(`/transaction/${transactionId}/resume`);
    return data;
  },
};

export { TransactionService };