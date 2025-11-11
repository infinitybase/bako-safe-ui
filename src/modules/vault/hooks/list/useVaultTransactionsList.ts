import { TransactionStatus } from 'bakosafe';
import { useCallback, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { useFilterTxType } from '@/modules/transactions/hooks/filter/useFilterTxType';
import { useTransactionState } from '@/modules/transactions/states';

import { useVaultTransactionsRequest } from './useVaultTransactionsRequest';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT_REQUIREMENTS,
  COMPLETED = TransactionStatus.SUCCESS,
  DECLINED = TransactionStatus.DECLINED,
}

interface IUseVaultTransactionsListProps {
  vaultId?: string;
}

export type IUseVaultTransactionsList = ReturnType<
  typeof useVaultTransactionsList
>;

const useVaultTransactionsList = ({
  vaultId,
}: IUseVaultTransactionsListProps = {}) => {
  const navigate = useNavigate();
  const inView = useInView();

  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);

  const handleResetStatusFilter = useCallback(() => {
    if (filter !== StatusFilter.ALL) setFilter(StatusFilter.ALL);
  }, [filter]);

  const { selectedTransaction, setSelectedTransaction } = useTransactionState();
  const {
    txFilterType,
    handleIncomingAction,
    handleOutgoingAction,
    setTxFilterType,
    handleAllAction,
  } = useFilterTxType(handleResetStatusFilter);

  const {
    transactions,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
    queryKey,
  } = useVaultTransactionsRequest({
    predicateId: vaultId ? [vaultId] : undefined,
    status: filter ? [filter] : undefined,
    type: txFilterType,
    id: selectedTransaction.id,
  });

  const observer = useRef<IntersectionObserver>(null);
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

  const handlePendingStatusChange = () => {
    setTxFilterType(undefined);
    setFilter(StatusFilter.PENDING);
  };

  return {
    request: {
      isLoading,
      isFetching,
      hasNextPage,
      fetchNextPage,
      refetch,
      queryKey,
    },
    handlers: {
      selectedTransaction,
      setSelectedTransaction,
      navigate,
      handleIncomingAction,
      handleOutgoingAction,
      handlePendingStatusChange,
      listTransactionTypeFilter: setTxFilterType,
      handleAllAction,
    },
    filter: {
      set: setFilter,
      value: filter,
      txFilterType,
    },
    inView,
    defaultIndex: selectedTransaction?.id ? [0] : [],
    lists: {
      transactions,
      limitedTransactions: transactions?.slice(0, 1),
    },
    transactionsRef: lastElementRef,
  };
};

export { useVaultTransactionsList };
