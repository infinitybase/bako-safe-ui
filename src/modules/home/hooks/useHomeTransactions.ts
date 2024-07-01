import {
  ITransactionsGroupedByMonth,
  TransactionType,
} from '@/modules/transactions/services';
import { useHomeTransactionsRequest } from './useHomeTransationsRequest';

const useHomeTransactions = (txFilterType?: TransactionType | undefined) => {
  const homeTranscationsRequest = useHomeTransactionsRequest(txFilterType);

  return {
    transactions: homeTranscationsRequest?.data
      ?.data as unknown as ITransactionsGroupedByMonth[],
  };
};

export { useHomeTransactions };
