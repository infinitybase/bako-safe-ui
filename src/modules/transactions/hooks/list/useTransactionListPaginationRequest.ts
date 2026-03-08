import { useQuery } from '@tanstack/react-query';
import { IListTransactions, ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { api } from '@/modules/core/services/api';
import { FILTER_MESSAGES } from '@/modules/core/constants/errorMessages';

export interface TransactionListResponse {
  transactions: ITransaction[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const fetchTransactions = async (filters: IListTransactions): Promise<TransactionListResponse> => {
  const params = new URLSearchParams();
  
  if (filters.predicateAddress) {
    params.append('predicateAddress', filters.predicateAddress.toString());
  }
  
  if (filters.to) {
    params.append('to', filters.to.toString());
  }
  
  if (filters.status) {
    params.append('status', filters.status);
  }
  
  if (filters.dateStart) {
    params.append('dateStart', filters.dateStart);
  }
  
  if (filters.dateEnd) {
    params.append('dateEnd', filters.dateEnd);
  }

  const response = await api.get(`/transactions?${params.toString()}`);
  
  // Handle empty results with proper message
  if (response.data.transactions.length === 0 && (filters.dateStart || filters.dateEnd)) {
    return {
      ...response.data,
      message: 'Nenhuma transação encontrada no período selecionado'
    };
  }
  
  return response.data;
};

export const useTransactionListPaginationRequest = (filters: IListTransactions) => {
  return useQuery({
    queryKey: ['transactions', 'list', filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 30000,
    refetchOnWindowFocus: false
  });
};