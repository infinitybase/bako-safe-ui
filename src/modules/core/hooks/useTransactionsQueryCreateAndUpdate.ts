export const useTransactionsQueryCreateAndUpdate = (
  oldData: any,
  newTransaction: any,
) => {
  if (!oldData) return oldData;

  const { type, transaction } = newTransaction;

  if (type === '[UPDATED]') {
    return {
      ...oldData,
      data: oldData.data.map((tx: any) =>
        tx.id === transaction.id ? transaction : tx,
      ),
    };
  }

  return {
    ...oldData,
    data: [transaction, ...oldData.data],
  };
};
