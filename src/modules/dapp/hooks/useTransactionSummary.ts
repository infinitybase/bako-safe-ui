import { useMutation } from 'react-query';

import { FuelTransactionService, TransactionSimulateParams } from '../services';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useTransactionSummary = () => {
  const { data, mutate, ...mutation } = useMutation(
    'dapp/transaction-summary',
    async (params: TransactionSimulateParams) => {
      await delay(600);
      return FuelTransactionService.simulate(params);
    },
  );

  return {
    transactionSummary: data,
    getTransactionSummary: mutate,
    ...mutation,
  };
};

export { useTransactionSummary };
