import { TransactionStatus } from 'bakosafe';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { ITransactionsGroupedByMonth } from '../../services';
import { TransactionType } from 'bakosafe';
import { useTransactionState } from '../../states';
import { useTransactionListPaginationRequest } from './useTransactionListPaginationRequest';
import { useFilterTxType } from '../filter';
import { useGetParams } from '@/modules/core';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT_REQUIREMENTS,
  COMPLETED = TransactionStatus.SUCCESS,
  DECLINED = TransactionStatus.DECLINED,
}

interface IUseTransactionListProps {
  workspaceId?: string;
  byMonth?: boolean;
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
  byMonth = false,
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
    transactionsPages,
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
    byMonth,
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

  const infinityTransactions = useMemo(() => {
    return transactionsPages?.pages.reduce(
      (acc: ITransactionsGroupedByMonth[], page) => {
        return [...acc, ...page.data];
      },
      [],
    );
  }, [transactionsPages]);

  const pendingTransactions = () => {
    const result = {};
    infinityTransactions?.forEach((item) => {
      return item.transactions.forEach((transaction) => {
        if (result[transaction.id]) return;

        result[transaction.id] = {
          status: transaction.status,
          hash: transaction.hash,
          id: transaction.id,
          predicateId: transaction.predicateId,
          resume: {
            witnesses: transaction.resume.witnesses,
          },
        };
      });
    });

    return result;
  };

  return {
    request: {
      isLoading: !transactionsPages && isLoading && !isFetching,
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
    infinityTransactionsRef: lastElementRef,
    lists: {
      transactions,
      infinityTransactions,
      vaultDetailsLimitedTransactions: infinityTransactions?.slice(0, 1),
    },
    pendingTransactions: pendingTransactions(),
  };
};

export { useTransactionList };
