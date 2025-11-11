import { useCallback, useMemo, useState } from 'react';

import { useGroupTransactionsByDay } from '@/modules/core/hooks/useGroupTransactionsByDay';
import { StatusFilter } from '@/modules/transactions';
import { useFilterTxType } from '@/modules/transactions/hooks/filter';

import { useHomeTransactionsRequest } from './useHomeTransationsRequest';

export type IUseHomeTransactionsReturn = ReturnType<typeof useHomeTransactions>;

const useHomeTransactions = (workspaceId: string) => {
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);

  const handleResetStatusFilter = useCallback(() => {
    if (filter !== StatusFilter.ALL) setFilter(StatusFilter.ALL);
  }, [filter]);

  const {
    txFilterType,
    handleIncomingAction,
    handleOutgoingAction,
    setTxFilterType,
    handleAllAction,
  } = useFilterTxType(handleResetStatusFilter);

  const { data, isFetching, isLoading, refetch, hasNextPage, fetchNextPage } =
    useHomeTransactionsRequest({
      workspaceId,
      type: txFilterType,
      status: filter ? [filter] : undefined,
    });

  const tx = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data],
  );

  const transactions = useGroupTransactionsByDay(tx);

  const handlePendingStatusChange = useCallback(() => {
    setTxFilterType(undefined);
    setFilter(StatusFilter.PENDING);
  }, [setTxFilterType, setFilter]);

  return {
    transactions,
    request: {
      isFetching,
      isLoading,
      refetch,
      hasNextPage,
      fetchNextPage,
    },
    filter: {
      filter,
      setFilter,
      txFilterType,
      handleIncomingAction,
      handleOutgoingAction,
      setTxFilterType,
      handleAllAction,
      handlePendingStatusChange,
    },
  };
};

export { useHomeTransactions };
