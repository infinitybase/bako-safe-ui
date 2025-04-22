import { useMemo } from 'react';

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

  const transactionHistory = useMemo(
    () => transactionHistoryRequest?.data?.map((transaction) => transaction),
    [transactionHistoryRequest],
  );

  return {
    ...transactionHistoryRequest,
    transactionHistory,
  };
};
