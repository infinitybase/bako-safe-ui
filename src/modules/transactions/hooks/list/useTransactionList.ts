import { TransactionStatus, TransactionType } from 'bakosafe';
import { useCallback, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { useGetParams } from '@/modules/core';

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
}

export type IUseTransactionList = ReturnType<typeof useTransactionList>;

export interface IPendingTransactionDetails {
  status: string;
  hash: string;
  id: string;
  predicateId: string;
}

export interface IPendingTransactionsRecord {
  [transactionId: string]: IPendingTransactionDetails;
}

const useTransactionList = ({
  workspaceId = '',
}: IUseTransactionListProps = {}) => {
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const { selectedTransaction, setSelectedTransaction } = useTransactionState();

  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const {
    txFilterType,
    handleIncomingAction,
    handleOutgoingAction,
    setTxFilterType,
  } = useFilterTxType();

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
  });

  const observer = useRef<IntersectionObserver>();
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
      isLoading: !transactions && isLoading && !isFetching,
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
    },
    filter: {
      set: setFilter,
      value: filter,
      txFilterType,
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
