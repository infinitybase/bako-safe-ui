import { TransactionStatus, TransactionType } from 'bakosafe';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { useGetParams } from '@/modules/core';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';

import { useTransactionState } from '../../states';
import { useFilterTxType } from '../filter';
import { useTransactionListPaginationRequest } from './useTransactionListPaginationRequest';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT_REQUIREMENTS,
  COMPLETED = TransactionStatus.SUCCESS,
  DECLINED = TransactionStatus.DECLINED,
}

export interface DateRangeFilter {
  dateFrom?: string;
  dateTo?: string;
}

interface IUseTransactionListProps {
  workspaceId?: string;
  type?: TransactionType;
}

export type IUseTransactionList = ReturnType<typeof useTransactionList>;

export type IPendingTransactionDetails = Pick<
  ITransaction,
  | 'status'
  | 'hash'
  | 'id'
  | 'predicateId'
  | 'resume'
  | 'name'
  | 'predicateAddress'
>;

export interface IPendingTransactionsRecord {
  [transactionId: string]: IPendingTransactionDetails;
}

const STORAGE_KEY = 'transaction_date_filter';

const useTransactionList = ({
  workspaceId = '',
}: IUseTransactionListProps = {}) => {
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>(() => {
    // Load persisted filter from sessionStorage
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [dateFilterError, setDateFilterError] = useState<string>('');
  const { selectedTransaction, setSelectedTransaction } = useTransactionState();

  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  // Persist filter to sessionStorage whenever it changes
  useEffect(() => {
    try {
      if (dateFilter.dateFrom || dateFilter.dateTo) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dateFilter));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [dateFilter]);

  const handleResetStatusFilter = useCallback(() => {
    if (filter !== StatusFilter.ALL) setFilter(StatusFilter.ALL);
  }, [filter]);

  const {
    txFilterType,
    handleIncomingAction,
    handleOutgoingAction,
    setTxFilterType,
  } = useFilterTxType(handleResetStatusFilter);

  const validateDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
      return 'Ambos os campos de data são obrigatórios';
    }
    
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      
      // Validate date format
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return 'Formato de data inválido';
      }
      
      if (fromDate > toDate) {
        return 'Data inicial deve ser anterior à data final';
      }
      
      // Validate maximum 2 years interval
      const twoYearsInMs = 2 * 365 * 24 * 60 * 60 * 1000;
      if (toDate.getTime() - fromDate.getTime() > twoYearsInMs) {
        return 'Intervalo máximo permitido é de 2 anos';
      }
    }
    
    return '';
  }, []);

  const handleApplyDateFilter = useCallback((dateFrom?: string, dateTo?: string) => {
    const error = validateDateRange(dateFrom, dateTo);
    
    if (error) {
      setDateFilterError(error);
      return false;
    }
    
    setDateFilterError('');
    setDateFilter({ dateFrom, dateTo });
    return true;
  }, [validateDateRange]);

  const handleClearDateFilter = useCallback(() => {
    setDateFilter({});
    setDateFilterError('');
  }, []);

  const navigate = useNavigate();
  const inView = useInView();

  const {
    transactions,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useTransactionListPaginationRequest({
    workspaceId: workspaceId,
    predicateId: vaultId ? [vaultId] : undefined,
    id: selectedTransaction.id,
    status: filter ? [filter] : undefined,
    type: txFilterType,
    dateFrom: dateFilter.dateFrom,
    dateTo: dateFilter.dateTo,
  });

  const observer = useRef<IntersectionObserver>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading],
  );

  return {
    request: {
      isLoading,
      isFetching,
      hasNextPage,
      fetchNextPage,
      refetch,
    },
    handlers: {
      selectedTransaction,
      setSelectedTransaction,
      navigate,
      handleIncomingAction,
      handleOutgoingAction,
      listTransactionTypeFilter: setTxFilterType,
      handleApplyDateFilter,
      handleClearDateFilter,
    },
    filter: {
      set: setFilter,
      value: filter,
      txFilterType,
      dateFilter,
      dateFilterError,
    },
    inView,
    defaultIndex: selectedTransaction?.id ? [0] : [],
    transactionsRef: lastElementRef,
    lists: {
      transactions,
    },
  };
};

export { useTransactionList };