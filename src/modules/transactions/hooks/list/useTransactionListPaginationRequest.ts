import { useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';

import { WorkspacesQueryKey } from '@/modules/core';
import { SortOptionTx } from '@/modules/core/hooks/bakosafe/utils/types';
import { useGroupTransactionsByDay } from '@/modules/core/hooks/useGroupTransactionsByDay';
import { DEFAULT_INITIAL_PAGE_PARAM } from '@/utils/constants';

import {
  GetTransactionParams,
  TransactionOrderBy,
  TransactionService,
} from '../../services';
import { StatusFilter } from './useTransactionList';

type UseTransactionListPaginationParams = Omit<
  GetTransactionParams,
  'perPage' | 'page'
> & {
  workspaceId: string;
  dateFrom?: Date;
  dateTo?: Date;
};

const validateDateRange = (dateFrom?: Date, dateTo?: Date): boolean => {
  if (!dateFrom || !dateTo) return true;
  
  if (dateTo < dateFrom) {
    toast.error('Data fim deve ser posterior à data início');
    return false;
  }
  
  return true;
};

const useTransactionListPaginationRequest = (
  params: UseTransactionListPaginationParams,
) => {
  const isValidDateRange = validateDateRange(params.dateFrom, params.dateTo);
  const hasShownEmptyMessage = useRef(false);
  
  const queryParams = {
    ...params,
    dateFrom: isValidDateRange ? params.dateFrom : undefined,
    dateTo: isValidDateRange ? params.dateTo : undefined,
  };

  const { data, ...query } = useInfiniteQuery({
    queryKey: WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      queryParams.workspaceId,
      queryParams.status as StatusFilter,
      queryParams.predicateId?.[0],
      queryParams.id,
      queryParams.type,
      queryParams.dateFrom,
      queryParams.dateTo,
    ),
    queryFn: ({ pageParam }) =>
      TransactionService.getTransactionsPagination({
        ...queryParams,
        perPage: 5,
        page: pageParam || DEFAULT_INITIAL_PAGE_PARAM,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOptionTx.DESC,
      }),
    enabled: window.location.pathname != '/' && isValidDateRange,
    initialPageParam: DEFAULT_INITIAL_PAGE_PARAM,
    refetchOnWindowFocus: false,
    // Socket events handle real-time updates
    staleTime: 1000 * 60 * 2, // 2 minutes
    getNextPageParam: (lastPage) =>
      lastPage.currentPage !== lastPage.totalPages
        ? lastPage.nextPage
        : undefined,
  });

  const transactionsList = data?.pages.map((page) => page.data).flat() ?? [];
  const hasNoTransactions = transactionsList.length === 0 && !query.isLoading && !query.isFetching;
  const hasDateFilters = params.dateFrom || params.dateTo;

  // Show specific message when no transactions found with date filters
  useEffect(() => {
    if (hasNoTransactions && hasDateFilters && isValidDateRange && !hasShownEmptyMessage.current) {
      toast.info('Nenhuma transação encontrada no período selecionado');
      hasShownEmptyMessage.current = true;
    }
    
    // Reset flag when filters change or data is loading
    if (query.isLoading || !hasDateFilters) {
      hasShownEmptyMessage.current = false;
    }
  }, [hasNoTransactions, hasDateFilters, isValidDateRange, query.isLoading]);

  return {
    ...query,
    transactions: useGroupTransactionsByDay(transactionsList),
  };
};

export { useTransactionListPaginationRequest };