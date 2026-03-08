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

const validateDateRange = (dateFrom?: Date, dateTo?: Date): string | null => {
  if (!dateFrom && !dateTo) return null;
  
  // Validate date format
  if (dateFrom && isNaN(dateFrom.getTime())) {
    return 'Formato de data início inválido';
  }
  
  if (dateTo && isNaN(dateTo.getTime())) {
    return 'Formato de data fim inválido';
  }
  
  if (dateFrom && dateTo && dateFrom > dateTo) {
    return 'Data fim deve ser posterior à data início';
  }
  
  return null;
};

const useTransactionListPaginationRequest = (
  params: UseTransactionListPaginationParams,
) => {
  const dateValidationError = validateDateRange(params.dateFrom, params.dateTo);
  const hasShownToastRef = useRef(false);
  const prevParamsRef = useRef<UseTransactionListPaginationParams | null>(null);
  
  // Show validation error toast
  useEffect(() => {
    if (dateValidationError) {
      toast.error(dateValidationError);
    }
  }, [dateValidationError]);

  const { data, ...query } = useInfiniteQuery({
    queryKey: WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      params.workspaceId,
      params.status as StatusFilter,
      params.predicateId?.[0],
      params.id,
      params.type,
      params.dateFrom,
      params.dateTo,
    ),
    queryFn: ({ pageParam }) =>
      TransactionService.getTransactionsPagination({
        ...params,
        perPage: 5,
        page: pageParam || DEFAULT_INITIAL_PAGE_PARAM,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOptionTx.DESC,
      }),
    enabled: window.location.pathname != '/' && !dateValidationError,
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
  const groupedTransactions = useGroupTransactionsByDay(transactionsList);

  // Check if parameters changed to reset toast flag
  const currentParams = JSON.stringify({
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    status: params.status,
    type: params.type,
    predicateId: params.predicateId,
  });
  
  const prevParams = JSON.stringify({
    dateFrom: prevParamsRef.current?.dateFrom,
    dateTo: prevParamsRef.current?.dateTo,
    status: prevParamsRef.current?.status,
    type: prevParamsRef.current?.type,
    predicateId: prevParamsRef.current?.predicateId,
  });

  if (currentParams !== prevParams) {
    hasShownToastRef.current = false;
    prevParamsRef.current = params;
  }

  // Check if no transactions found in date range
  const hasDateFilter = params.dateFrom || params.dateTo;
  const hasNoTransactions = !query.isLoading && transactionsList.length === 0;
  
  useEffect(() => {
    if (hasDateFilter && hasNoTransactions && !query.isError && !hasShownToastRef.current) {
      toast.info('Nenhuma transação encontrada no período selecionado');
      hasShownToastRef.current = true;
    }
  }, [hasDateFilter, hasNoTransactions, query.isError]);

  return {
    ...query,
    transactions: groupedTransactions,
  };
};

export { useTransactionListPaginationRequest };