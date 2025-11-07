import { TransactionStatus, TransactionType } from 'bakosafe';
import { useCallback, useRef, useState } from 'react';
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

const useTransactionList = ({
  workspaceId = '',
}: IUseTransactionListProps = {}) => {
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const { selectedTransaction, setSelectedTransaction } = useTransactionState();

  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

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
