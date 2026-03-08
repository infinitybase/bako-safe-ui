import { useMemo } from 'react';
import { ITransaction } from './bakosafe/utils/types';

export const useGroupTransactionsByDay = (transactions: ITransaction[]) => {
  return useMemo(() => {
    const grouped = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, ITransaction[]>);

    return Object.entries(grouped).map(([date, txs]) => ({
      date,
      transactions: txs,
    }));
  }, [transactions]);
};