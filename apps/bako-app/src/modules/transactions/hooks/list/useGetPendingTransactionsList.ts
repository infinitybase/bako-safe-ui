import { ITransactionsGroupedByMonth } from '@bako-safe/services/modules';

import { IPendingTransactionsRecord } from './useTransactionList';

const usePendingTransactionsList = (
  homeTransactions: ITransactionsGroupedByMonth[],
  transactionsPageList: ITransactionsGroupedByMonth[],
  vaultTransactionsList: ITransactionsGroupedByMonth[],
): IPendingTransactionsRecord => {
  const mergedTransactionsList = [
    ...(homeTransactions ?? []),
    ...(transactionsPageList ?? []),
    ...(vaultTransactionsList ?? []),
  ];

  const result = {};
  mergedTransactionsList?.forEach((item) => {
    return item.transactions.forEach((transaction) => {
      if (!transaction) return;
      if (result[transaction.id]) return;
      result[transaction.id] = {
        status: transaction.status,
        hash: transaction.hash,
        id: transaction.id,
        predicateId: transaction.predicateId,
        predicateAddress: transaction.predicate?.predicateAddress,
        resume: {
          witnesses: transaction.resume?.witnesses ?? [],
          requiredSigners: transaction.resume?.requiredSigners ?? 0,
        },
      };
    });
  });

  return result;
};

export { usePendingTransactionsList };
