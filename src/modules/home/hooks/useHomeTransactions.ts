import { useFilterTxType } from '@/modules/transactions/hooks/filter';
import { useHomeTransactionsRequest } from './useHomeTransationsRequest';

export type IUseHomeTransactionsReturn = ReturnType<typeof useHomeTransactions>;

const useHomeTransactions = (workspaceId: string) => {
  const {
    txFilterType,
    handleIncomingAction,
    handleOutgoingAction,
    setTxFilterType,
  } = useFilterTxType();

  const { data, isFetching, isLoading } = useHomeTransactionsRequest(
    workspaceId,
    txFilterType,
  );

  return {
    transactions: data?.data,
    request: {
      isFetching,
      isLoading,
    },
    handlers: {
      handleIncomingAction,
      handleOutgoingAction,
      homeTransactionTypeFilter: setTxFilterType,
    },
  };
};

export { useHomeTransactions };
