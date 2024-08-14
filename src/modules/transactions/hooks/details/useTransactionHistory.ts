import { useEffect, useState } from 'react';

import { ITransactionHistory } from '../../services';
import { useTransactionHistoryRequest } from './useTransactionHistoryRequest';

export const useTransactionHistory = (
  transactionId: string,
  predicateId: string,
) => {
  const [transactionHistory, setTransactionHistory] = useState<
    ITransactionHistory[] | null
  >(null);

  const transactionHistoryRequest = useTransactionHistoryRequest(
    transactionId,
    predicateId,
  );

  useEffect(() => {
    if (transactionHistoryRequest.data) {
      setTransactionHistory(
        transactionHistoryRequest.data.map((transaction) => transaction),
      );
    }
  }, [transactionHistoryRequest.data, transactionId]);

  return {
    ...transactionHistoryRequest,
    transactionHistory,
  };
};
