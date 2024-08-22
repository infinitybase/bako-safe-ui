import { ITransactionsGroupedByMonth } from '../../services';
import { IPendingTransactionsRecord } from './useTransactionList';

const usePendingTransactionsList = (
  homeTransactions: ITransactionsGroupedByMonth[],
  transactionsPageList: ITransactionsGroupedByMonth[],
): IPendingTransactionsRecord => {
  const mergedTransactionsList =
    homeTransactions && transactionsPageList
      ? homeTransactions.concat(transactionsPageList)
      : [];

  const result = {};
  mergedTransactionsList?.forEach((item) => {
    return item.transactions.forEach((transaction) => {
      if (result[transaction.id]) return;
      result[transaction.id] = {
        status: transaction.status,
        hash: transaction.hash,
        id: transaction.id,
        predicateId: transaction.predicateId,
        resume: {
          witnesses: transaction.resume.witnesses,
        },
      };
    });
  });

  return result;
};

export { usePendingTransactionsList };
