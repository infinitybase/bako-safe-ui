import { TransactionStatus } from 'bakosafe';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { useFilterTxType } from '@/modules/transactions/hooks/filter/useFilterTxType';
import { ITransactionsGroupedByMonth } from '@/modules/transactions/services';
import { useTransactionState } from '@/modules/transactions/states';

import { useVaultTransactionsRequest } from './useVaultTransactionsRequest';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT_REQUIREMENTS,
  COMPLETED = TransactionStatus.SUCCESS,
  DECLINED = TransactionStatus.DECLINED,
}

interface IUseVaultTransactionsListProps {
  byMonth?: boolean;
  vaultId?: string;
}

export type IUseVaultTransactionsList = ReturnType<
  typeof useVaultTransactionsList
>;

const useVaultTransactionsList = ({
  byMonth = false,
  vaultId,
}: IUseVaultTransactionsListProps = {}) => {
  const navigate = useNavigate();
  const inView = useInView();

  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);

  const { selectedTransaction, setSelectedTransaction } = useTransactionState();
  const {
    txFilterType,
    handleIncomingAction,
    handleOutgoingAction,
    setTxFilterType,
  } = useFilterTxType();

  const {
    transactionsPages,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useVaultTransactionsRequest({
    predicateId: vaultId ? [vaultId] : undefined,
    status: filter ? [filter] : undefined,
    byMonth,
    type: txFilterType,
    id: selectedTransaction.id,
  });

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetching &&
          !selectedTransaction.id
        ) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading],
  );

  const infinityTransactions = useMemo(() => {
    return transactionsPages?.pages?.reduce(
      (acc: ITransactionsGroupedByMonth[], page) => {
        return [...acc, ...page.data];
      },
      [],
    );
  }, [transactionsPages]);

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
    lists: {
      transactionsPages,
      infinityTransactions,
      limitedTransactions: infinityTransactions?.slice(0, 1),
    },
    infinityTransactionsRef: lastElementRef,
  };
};

export { useVaultTransactionsList };
