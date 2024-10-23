import { useAccordionItemState } from '@chakra-ui/react';
import {
  ITransactionHistory,
  TransactionService,
} from '@services/modules/transaction';
import { QueryState, useQuery } from '@tanstack/react-query';

import { queryClient } from '@/config';

export const TRANSACTION_HISTORY_QUERY_KEY = 'transaction/history';

export interface UseTransactionHistoryRequestProps {
  transactionId: string;
  predicateId: string;
  isMobileDetailsOpen: boolean;
  isTransactionSuccess: boolean;
  isDeposit: boolean;
}

const useTransactionHistoryRequest = ({
  isMobileDetailsOpen,
  predicateId,
  transactionId,
  isTransactionSuccess,
  isDeposit,
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
      (isOpen && !cachedData?.data && !isDeposit) ||
      (!cachedData?.data && isMobileDetailsOpen && !isDeposit) ||
      (isOpen && isTransactionSuccess && cachedDataLength <= 2 && !isDeposit) ||
      (isMobileDetailsOpen &&
        isTransactionSuccess &&
        cachedDataLength <= 2 &&
        !isDeposit),
  });
};

export { useTransactionHistoryRequest };
