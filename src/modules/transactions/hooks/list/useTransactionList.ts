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

interface IUseTransactionListProps {
  workspaceId?: string;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
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

const STORAGE_KEY = 'transaction-date-filter';

const useTransactionList = ({
  workspaceId = '',
  dateFrom,
  dateTo,
}: IUseTransactionListProps = {}) => {
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const { selectedTransaction, setSelectedTransaction } = useTransactionState();

  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  // Load persisted date filters from sessionStorage
  const [persistedDateFrom, setPersistedDateFrom] = useState<string | undefined>(() => {
    if (dateFrom) return dateFrom;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.dateFrom;
      }
    } catch (error) {
      console.warn('Failed to load date filter from sessionStorage:', error);
    }
    return undefined;
  });

  const [persistedDateTo, setPersistedDateTo] = useState<string | undefined>(() => {
    if (dateTo) return dateTo;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.dateTo;
      }
    } catch (error) {
      console.warn('Failed to load date filter from sessionStorage:', error);
    }
    return undefined;
  });

  // Persist date filters to sessionStorage
  useEffect(() => {
    try {
      if (persistedDateFrom || persistedDateTo) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          dateFrom: persistedDateFrom,
          dateTo: persistedDateTo
        }));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to persist date filter to sessionStorage:', error);
    }
  }, [persistedDateFrom, persistedDateTo]);

  const handleResetStatusFilter = useCallback(() => {
    if (filter !== StatusFilter.ALL) setFilter(StatusFilter.ALL);
  }, [filter]);

  const {
    txFilterType,
    handleIncomingAction,
    handleOutgoingAction,
    setTxFilterType,
  } = useFilterTxType(handleResetStatusFilter);

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
    dateFrom: dateFrom || persistedDateFrom,
    dateTo: dateTo || persistedDateTo,
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

  const updateDateFilter = useCallback((newDateFrom?: string, newDateTo?: string) => {
    setPersistedDateFrom(newDateFrom);
    setPersistedDateTo(newDateTo);
  }, []);

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
      updateDateFilter,
    },
    filter: {
      set: setFilter,
      value: filter,
      txFilterType,
      dateFrom: dateFrom || persistedDateFrom,
      dateTo: dateTo || persistedDateTo,
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