import { QueryState, useQuery } from '@tanstack/react-query';
import { useAccordionItemContext } from 'bako-ui';

import { queryClient } from '@/config';
import {
  ITransactionHistory,
  TransactionService,
} from '@/modules/transactions/services';

export const TRANSACTION_HISTORY_QUERY_KEY = 'transaction/history';

export const getTransactionHistoryQueryKey = (
  transactionId: string,
  predicateId: string,
) => {
  return [TRANSACTION_HISTORY_QUERY_KEY, transactionId, predicateId].filter(
    Boolean,
  );
};

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
  const { expanded: isOpen } = useAccordionItemContext();

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
