import { useMutation } from '@tanstack/react-query';

import {
  TransactionSimulateParams,
  useFuelTransactionService,
} from '../services/fuel-transaction';

const useTransactionSummary = () => {
  const { simulate } = useFuelTransactionService();
  const { data, mutate, ...mutation } = useMutation({
    mutationKey: ['dapp/transaction-summary'],
    mutationFn: async (params: TransactionSimulateParams) => {
      return simulate(params);
    },
    retry: (failureCount, error) => {
      console.log('GET_SUMMARY_ERROR:', error);
      console.log('FAILURE_COUNT:', failureCount);
      if (failureCount >= 1 && failureCount < 3) {
        console.log('ACTVATING_RETRY_MUTATION');
        return true; // Do the retry
      }
      return false; // Do not retry
    },
    retryDelay: 1000 * 60 * 1, // 1 min delay
  });

  return {
    ...mutation,
    transactionSummary: data,
    getTransactionSummary: mutate,
  };
};

export { useTransactionSummary };
