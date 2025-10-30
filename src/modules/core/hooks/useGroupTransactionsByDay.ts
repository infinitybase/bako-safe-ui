import { formatInTimeZone } from 'date-fns-tz';

import {
  ITransactionsGroupedByDay,
  TransactionWithVault,
} from '@/modules/transactions/services';

const convertToArray = (groupedData: {
  [key: string]: TransactionWithVault[];
}) => {
  if (groupedData) {
    return Object.keys(groupedData).map((day) => ({
      day,
      transactions: groupedData[day],
    }));
  }
  return [];
};

export const useGroupTransactionsByDay = (
  transactions?: TransactionWithVault[],
): ITransactionsGroupedByDay[] => {
  const groupedData = transactions
    ?.filter((transaction) => !!transaction)
    .reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const today = new Date();
        // Check if the transaction date is today
        const isToday =
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear();

        // format like a -> Mon, 18th September 2025 or if is current day -> Today
        const day = isToday
          ? 'Today'
          : formatInTimeZone(
              transactionDate,
              Intl.DateTimeFormat().resolvedOptions().timeZone,
              "EEE, d 'of' MMMM yyyy",
            );

        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(transaction);
        return acc;
      },
      {} as { [key: string]: TransactionWithVault[] },
    );

  return groupedData ? convertToArray(groupedData) : [];
};
