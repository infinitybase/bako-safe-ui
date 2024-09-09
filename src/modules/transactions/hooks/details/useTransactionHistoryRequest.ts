import { useAccordionItemState } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

import { useGetCachedQueryData } from '@/modules';
import { TransactionService } from '@/modules/transactions/services';

export const TRANSACTION_HISTORY_QUERY_KEY = 'transaction/history';

const useTransactionHistoryRequest = (
  transactionId: string,
  predicateId: string,
) => {
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
    enabled: isOpen && !cachedData?.data,
  });
};

export { useTransactionHistoryRequest };
