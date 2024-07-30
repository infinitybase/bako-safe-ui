import { TransactionStatus } from 'bakosafe';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { ITransactionsGroupedByMonth } from '../../services';
import { TransactionType } from 'bakosafe';
import { useTransactionState } from '../../states';
import { useTransactionsSignaturePending } from './useTotalSignaturesPendingRequest';
import { useTransactionListPaginationRequest } from './useTransactionListPaginationRequest';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT_REQUIREMENTS,
  COMPLETED = TransactionStatus.SUCCESS,
  DECLINED = TransactionStatus.DECLINED,
}

interface IUseTransactionListProps {
  byMonth?: boolean;
  type?: TransactionType;
}

const useTransactionList = ({
  byMonth = false,
  type = undefined,
}: IUseTransactionListProps = {}) => {
  const params = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const inView = useInView();
  const { account } = useWorkspaceContext();
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const { selectedTransaction, setSelectedTransaction } = useTransactionState();

  const pendingSignerTransactions = useTransactionsSignaturePending([
    params.vaultId!,
  ]);

  const {
    transactions,
    transactionsPages,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useTransactionListPaginationRequest({
    predicateId: params.vaultId ? [params.vaultId] : undefined,
    id: selectedTransaction.id,
    /* TODO: Change logic this */
    status: filter ? [filter] : undefined,
    byMonth,
    type,
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
    account,
    defaultIndex: selectedTransaction?.id ? [0] : [],
    pendingSignerTransactions,
    hasSkeleton: false,
    infinityTransactions,
    infinityTransactionsRef: lastElementRef,
  };
};

export { useTransactionList };
