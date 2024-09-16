import { useAccordionItemState } from '@chakra-ui/react';
import { QueryState, useQuery } from '@tanstack/react-query';

import { queryClient } from '@/config';
import {
  ITransactionHistory,
  TransactionService,
} from '@/modules/transactions/services';

export const TRANSACTION_HISTORY_QUERY_KEY = 'transaction/history';

export interface UseTransactionHistoryRequestProps {
  transactionId: string;
  predicateId: string;
  isMobileDetailsOpen: boolean;
  isTransactionSuccess: boolean;
}

const useTransactionHistoryRequest = ({
  isMobileDetailsOpen,
  predicateId,
  transactionId,
  isTransactionSuccess,
}: UseTransactionHistoryRequestProps) => {
  const { isOpen } = useAccordionItemState();

  const cachedData: QueryState<ITransactionHistory[] | undefined> | undefined =
    queryClient.getQueryState([
      TRANSACTION_HISTORY_QUERY_KEY,
      transactionId,
      predicateId,
    ]);

  const cachedDataLength = cachedData?.data?.length ?? 0;

  return useQuery({
    queryKey: [TRANSACTION_HISTORY_QUERY_KEY, transactionId, predicateId],
    queryFn: () =>
      TransactionService.getTransactionsHistory(transactionId, predicateId),

    enabled:
      (isOpen && !cachedData?.data) ||
      (!cachedData?.data && isMobileDetailsOpen) ||
      (isOpen && isTransactionSuccess && cachedDataLength <= 2) ||
      (isMobileDetailsOpen && isTransactionSuccess && cachedDataLength <= 2),
  });
};

export { useTransactionHistoryRequest };
