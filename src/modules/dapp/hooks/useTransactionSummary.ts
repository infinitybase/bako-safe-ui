import { useMutation } from 'react-query';

import {
  FuelTransactionService,
  TransactionSimulateParams,
} from '../services/fuel-transaction';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useTransactionSummary = () => {
  const { data, mutate, ...mutation } = useMutation(
    'dapp/transaction-summary',
    async (params: TransactionSimulateParams) => {
      await delay(600);
      return FuelTransactionService.simulate(params);
    },
  );

  /* TODO: Remove this */
  const operation2 = Object.create(data?.operations[0] ?? {});
  operation2.assetsSent = [];

  return {
    ...mutation,
    mainOperation: data?.operations[0],
    transactionSummary: data,
    getTransactionSummary: mutate,
  };
};

export { useTransactionSummary };
