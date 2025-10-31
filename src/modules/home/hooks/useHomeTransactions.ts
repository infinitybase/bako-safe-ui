import { useCallback, useState } from 'react';

import { useGroupTransactionsByDay } from '@/modules/core/hooks/useGroupTransactionsByDay';
import { StatusFilter } from '@/modules/transactions';
import { useFilterTxType } from '@/modules/transactions/hooks/filter';

import { useHomeTransactionsRequest } from './useHomeTransationsRequest';

export type IUseHomeTransactionsReturn = ReturnType<typeof useHomeTransactions>;

const useHomeTransactions = (workspaceId: string) => {
  const { data, isFetching, isLoading, refetch } =
    useHomeTransactionsRequest(workspaceId);
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

  const handlePendingStatusChange = () => {
    setTxFilterType(undefined);
    setFilter(StatusFilter.PENDING);
  };

  return {
    transactions: useGroupTransactionsByDay(data?.data),
    request: {
      isFetching,
      isLoading,
      refetch,
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
