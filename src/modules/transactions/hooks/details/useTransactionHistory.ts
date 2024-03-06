import { useMemo } from 'react';

import { useTransactionHistoryRequest } from './useTransactionHistoryRequest';

export const useTransactionHistory = (transactionId: string) => {
  const transactionHistoryRequest = useTransactionHistoryRequest(transactionId);

  const transactionHistory = useMemo(() => {
    if (transactionHistoryRequest.data) {
      return transactionHistoryRequest.data.map((transaction) => transaction);
    }
  }, [transactionHistoryRequest.data]);

  return {
    ...transactionHistoryRequest,
    transactionHistory,
  };
};
