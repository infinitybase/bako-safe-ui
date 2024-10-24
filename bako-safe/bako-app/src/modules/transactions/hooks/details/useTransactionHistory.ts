import { useTransactionHistoryRequest } from './useTransactionHistoryRequest';

export const useTransactionHistory = (
  transactionId: string,
  predicateId: string,
  isMobileDetailsOpen: boolean,
  isTransactionSuccess: boolean,
  isDeposit: boolean,
) => {
  const transactionHistoryRequest = useTransactionHistoryRequest({
    transactionId,
    predicateId,
    isMobileDetailsOpen,
    isTransactionSuccess,
    isDeposit,
  });

  return {
    ...transactionHistoryRequest,
    transactionHistory: transactionHistoryRequest?.data?.map(
      (transaction) => transaction,
    ),
  };
};
