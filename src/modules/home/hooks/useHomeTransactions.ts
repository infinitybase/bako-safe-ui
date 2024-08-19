import { useHomeTransactionsRequest } from './useHomeTransationsRequest';

export type IUseHomeTransactionsReturn = ReturnType<typeof useHomeTransactions>;

const useHomeTransactions = (workspaceId: string) => {
  const { data, isFetching, isLoading, refetch } =
    useHomeTransactionsRequest(workspaceId);

  return {
    transactions: data?.data,
    request: {
      isFetching,
      isLoading,
      refetch,
    },
  };
};

export { useHomeTransactions };
