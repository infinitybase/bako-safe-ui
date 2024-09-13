import { useTransactionHistoryRequest } from './useTransactionHistoryRequest';

export const useTransactionHistory = (
  transactionId: string,
  predicateId: string,
  isMobileDetailsOpen: boolean,
) => {
  const transactionHistoryRequest = useTransactionHistoryRequest({
    transactionId,
    predicateId,
    isMobileDetailsOpen,
  });

  return {
    ...transactionHistoryRequest,
    transactionHistory: transactionHistoryRequest?.data?.map(
      (transaction) => transaction,
    ),
  };
};
