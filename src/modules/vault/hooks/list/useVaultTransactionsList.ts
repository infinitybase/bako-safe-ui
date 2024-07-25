import { TransactionStatus, TransactionType } from 'bakosafe';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store';
import { useVaultTxRequest } from './useVaultTxRequest';
import { useTransactionState } from '@/modules/transactions/states';
import { ITransactionsGroupedByMonth } from '@/modules/transactions/services';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT_REQUIREMENTS,
  COMPLETED = TransactionStatus.SUCCESS,
  DECLINED = TransactionStatus.DECLINED,
}

interface IUseVaultTransactionsListProps {
  byMonth?: boolean;
  type?: TransactionType;
  vaultId?: string;
}

const useVaultTransactionsList = ({
  byMonth = false,
  type = undefined,
  vaultId,
}: IUseVaultTransactionsListProps = {}) => {
  const navigate = useNavigate();
  const inView = useInView();
  const { account } = useAuthStore();
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);

  const { selectedTransaction, setSelectedTransaction } = useTransactionState();

  const {
    transactionsPages,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useVaultTxRequest({
    predicateId: vaultId ? [vaultId] : undefined,
    id: selectedTransaction.id,
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
    return transactionsPages?.pages?.reduce(
      (acc: ITransactionsGroupedByMonth[], page) => {
        return [...acc, ...page.data];
      },
      [],
    );
  }, [transactionsPages]);

  return {
    transactionRequest: {
      isLoading,
      isFetching,
      hasNextPage,
      fetchNextPage,
    },
    selectedTransaction,
    setSelectedTransaction,
    navigate,
    params: { vaultId },
    filter: {
      set: setFilter,
      value: filter,
    },
    inView,
    account,
    defaultIndex: selectedTransaction?.id ? [0] : [],
    hasSkeleton: false,
    infinityTransactions,
    infinityTransactionsRef: lastElementRef,
  };
};

export { useVaultTransactionsList };
