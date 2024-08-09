import { TransactionStatus } from 'bakosafe';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { ITransactionsGroupedByMonth } from '../../services';
import { TransactionType } from 'bakosafe';
import { useTransactionState } from '../../states';
import { useTransactionListPaginationRequest } from './useTransactionListPaginationRequest';
import { useAuth } from '@/modules/auth';
import { useVerifyOnChain } from '../useVerifyOnChain';
import { useBakoSafeTransactionSend } from '@/modules/core';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT_REQUIREMENTS,
  COMPLETED = TransactionStatus.SUCCESS,
  DECLINED = TransactionStatus.DECLINED,
}

interface IUseTransactionListProps {
  requestInterval?: number;
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

// Interface for the pendingTransactions record
export interface IPendingTransactionsRecord {
  [transactionId: string]: IPendingTransactionDetails;
}

const useTransactionList = ({
  requestInterval = 1000 * 60 * 5,
  byMonth = false,
  type = undefined,
}: IUseTransactionListProps = {}) => {
  const params = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const inView = useInView();

  const {
    userInfos: { workspace },
  } = useAuth();

  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const { selectedTransaction, setSelectedTransaction } = useTransactionState();

  const {
    transactions,
    transactionsPages,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useTransactionListPaginationRequest(
    {
      workspaceId: workspace?.id,
      predicateId: params.vaultId ? [params.vaultId] : undefined,
      id: selectedTransaction.id,
      /* TODO: Change logic this */
      status: filter ? [filter] : undefined,
      byMonth,
      type,
    },
    requestInterval,
  );

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
        };
      });
    });

    return result;
  };

  return {
    transactionRequest: {
      transactions,
      isLoading,
      isFetching,
      hasNextPage,
      fetchNextPage,
      refetch,
    },
    selectedTransaction,
    setSelectedTransaction,
    navigate,
    params,
    filter: {
      set: setFilter,
      value: filter,
    },
    inView,
    defaultIndex: selectedTransaction?.id ? [0] : [],
    hasSkeleton: false,
    infinityTransactions,
    infinityTransactionsRef: lastElementRef,
    pendingTransactions: pendingTransactions(),
  };
};

export { useTransactionList };
