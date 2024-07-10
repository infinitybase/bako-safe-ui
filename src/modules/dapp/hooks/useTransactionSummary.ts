import { useMutation } from '@tanstack/react-query';

import {
  FuelTransactionService,
  TransactionSimulateParams,
} from '../services/fuel-transaction';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useTransactionSummary = () => {
  const { data, mutate, ...mutation } = useMutation({
    mutationKey: ['dapp/transaction-summary'],
    mutationFn: async (params: TransactionSimulateParams) => {
      await delay(600);
      return FuelTransactionService.simulate(params);
    },
  });

  return {
    ...mutation,
    transactionSummary: data,
    getTransactionSummary: mutate,
  };
};

export { useTransactionSummary };
