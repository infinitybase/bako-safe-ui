import { useAccordionItemState } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

import { useGetCachedQueryData } from '@/modules';
import { TransactionService } from '@/modules/transactions/services';

export const TRANSACTION_HISTORY_QUERY_KEY = 'transaction/history';

export interface UseTransactionHistoryRequestProps {
  transactionId: string;
  predicateId: string;
  isMobileDetailsOpen: boolean;
}

const useTransactionHistoryRequest = ({
  isMobileDetailsOpen,
  predicateId,
  transactionId,
}: UseTransactionHistoryRequestProps) => {
  const { isOpen } = useAccordionItemState();

  const { cachedData } = useGetCachedQueryData([
    TRANSACTION_HISTORY_QUERY_KEY,
    transactionId,
    predicateId,
  ]);

  return useQuery({
    queryKey: [TRANSACTION_HISTORY_QUERY_KEY, transactionId, predicateId],
    queryFn: () =>
      TransactionService.getTransactionsHistory(transactionId, predicateId),
    enabled:
      (isOpen && !cachedData?.data) ||
      (!cachedData?.data && isMobileDetailsOpen),
  });
};

export { useTransactionHistoryRequest };
