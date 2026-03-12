import { formatInTimeZone } from 'date-fns-tz';
import { useMemo } from 'react';

import {
  ITransactionsGroupedByDay,
  TransactionWithVault,
} from '@/modules/transactions/services';

export const useGroupTransactionsByDay = (
  transactions?: TransactionWithVault[],
): ITransactionsGroupedByDay[] => {
  return useMemo(() => {
    if (!transactions?.length) {
      return [];
    }

    const today = new Date();
    const todayDateString = today.toDateString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const groupedMap = new Map<string, TransactionWithVault[]>();

    for (const transaction of transactions) {
      if (!transaction) continue;

      const transactionDate = new Date(transaction.createdAt);

      const isToday = transactionDate.toDateString() === todayDateString;

      const day = isToday
        ? 'Today'
        : formatInTimeZone(transactionDate, timeZone, "EEE, d 'of' MMMM yyyy");

      const existingGroup = groupedMap.get(day);
      if (existingGroup) {
        existingGroup.push(transaction);
      } else {
        groupedMap.set(day, [transaction]);
      }
    }

    return Array.from(groupedMap.entries()).map(([day, transactions]) => ({
      day,
      transactions,
    }));
  }, [transactions]);
};
