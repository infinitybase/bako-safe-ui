import {
  ITransactionsGroupedByMonth,
  TransactionWithVault,
} from '@bako-safe/services/modules/transaction';

const convertToArray = (groupedData: {
  [key: string]: TransactionWithVault[];
}) => {
  if (groupedData) {
    return Object.keys(groupedData).map((monthYear) => ({
      monthYear,
      transactions: groupedData[monthYear],
    }));
  }
  return [];
};

const useGroupTransactionsByMonth = (
  transactions?: TransactionWithVault[],
): ITransactionsGroupedByMonth[] => {
  const groupedData = transactions
    ?.filter((transaction) => !!transaction)
    .reduce(
      (acc, transaction) => {
        const options = { year: 'numeric', month: 'long' } as const;
        const transactionDate = new Date(transaction.createdAt);
        const monthYear = transactionDate.toLocaleDateString('en-US', options);

        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(transaction);
        return acc;
      },
      {} as { [key: string]: TransactionWithVault[] },
    );

  return groupedData ? convertToArray(groupedData) : [];
};

export { useGroupTransactionsByMonth };
