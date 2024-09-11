import { useTransactionHistoryRequest } from './useTransactionHistoryRequest';

export const useTransactionHistory = (
  transactionId: string,
  predicateId: string,
) => {
  const transactionHistoryRequest = useTransactionHistoryRequest(
    transactionId,
    predicateId,
  );

  return {
    ...transactionHistoryRequest,
    transactionHistory: transactionHistoryRequest?.data?.map(
      (transaction) => transaction,
    ),
  };
};
