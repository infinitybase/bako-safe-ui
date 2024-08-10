import { useFilterTxType } from '@/modules/transactions/hooks/filter';
import { useHomeTransactionsRequest } from './useHomeTransationsRequest';

export type IUseHomeTransactionsReturn = ReturnType<typeof useHomeTransactions>;

const useHomeTransactions = (workspaceId: string) => {
  const { txFilterType, handleIncomingAction, handleOutgoingAction } =
    useFilterTxType();

  const { data, ...query } = useHomeTransactionsRequest(
    workspaceId,
    txFilterType,
  );

  return {
    transactions: data?.data,
    request: {
      ...query,
    },
    handlers: {
      handleIncomingAction,
      handleOutgoingAction,
    },
  };
};

export { useHomeTransactions };
