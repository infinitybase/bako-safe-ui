import { useQuery } from '@tanstack/react-query';
import { Address } from 'fuels';
import { TransactionStatus } from '@/modules/core/models';
import { IListTransactions } from '@/modules/core/hooks/bakosafe/utils/types';
import { useDateFilter, DateFilterState } from '../filter/useDateFilter';
import { useTransactionListPaginationRequest } from './useTransactionListPaginationRequest';
import { toast } from 'react-toastify';

export interface UseTransactionListParams {
  predicateAddress?: Address;
  to?: Address;
  status?: TransactionStatus;
  initialDateFilters?: DateFilterState;
}

export const useTransactionList = (params?: UseTransactionListParams) => {
  const {
    dateStart,
    dateEnd,
    setDateStart,
    setDateEnd,
    validateDateRange,
    clearDates,
    hasDateFilters
  } = useDateFilter(params?.initialDateFilters);

  const filters: IListTransactions = {
    predicateAddress: params?.predicateAddress,
    to: params?.to,
    status: params?.status,
    dateStart,
    dateEnd
  };

  const { data, isLoading, error, refetch } = useTransactionListPaginationRequest(filters);

  const applyFilters = () => {
    const validationError = validateDateRange();
    if (validationError) {
      toast.error(validationError);
      return false;
    }
    refetch();
    return true;
  };

  const clearAllFilters = () => {
    clearDates();
    refetch();
  };

  const hasActiveFilters = Boolean(
    params?.predicateAddress ||
    params?.to ||
    params?.status ||
    hasDateFilters
  );

  // Check if we have empty results with date filters for AC4
  const hasEmptyDateResults = Boolean(
    !isLoading &&
    (data?.transactions?.length === 0) &&
    hasDateFilters
  );

  const emptyMessage = hasEmptyDateResults 
    ? 'Nenhuma transação encontrada no período selecionado'
    : 'Nenhuma transação encontrada para os filtros aplicados';

  return {
    transactions: data?.transactions || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    dateStart,
    dateEnd,
    setDateStart,
    setDateEnd,
    applyFilters,
    clearAllFilters,
    hasActiveFilters,
    hasDateFilters,
    hasEmptyDateResults,
    emptyMessage,
    refetch
  };
};