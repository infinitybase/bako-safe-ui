import { useHomeTransactionsRequest } from './useHomeTransationsRequest';
import { TransactionType } from 'bakosafe';

export type IUseHomeTransactionsReturn = ReturnType<typeof useHomeTransactions>;

const useHomeTransactions = (
  workspaceId: string,
  txFilterType?: TransactionType | undefined,
) => {
  const homeTranscationsRequest = useHomeTransactionsRequest(
    workspaceId,
    txFilterType,
  );

  const pendingTransactions = homeTranscationsRequest?.data?.data.reduce(
    (acc, group) => {
      group.transactions.forEach((transaction) => {
        acc[transaction.id] = { status: transaction.status };
      });
      return acc;
    },
    {} as Record<string, { status: string }>,
  );

  return {
    transactions: homeTranscationsRequest?.data?.data,
    request: homeTranscationsRequest,
    pendingTransactions,
  };
};

export { useHomeTransactions };
