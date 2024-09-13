import { useTransactionHistoryRequest } from './useTransactionHistoryRequest';

export const useTransactionHistory = (
  transactionId: string,
  predicateId: string,
  isMobileDetailsOpen: boolean,
  isTransactionSuccess: boolean,
) => {
  const transactionHistoryRequest = useTransactionHistoryRequest({
    transactionId,
    predicateId,
    isMobileDetailsOpen,
    isTransactionSuccess,
  });

  return {
    ...transactionHistoryRequest,
    transactionHistory: transactionHistoryRequest?.data?.map(
      (transaction) => transaction,
    ),
  };
};
