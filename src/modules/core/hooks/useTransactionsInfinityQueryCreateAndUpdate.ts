export const useTransactionsInfinityQueryCreateAndUpdate = (
  oldData: any,
  newTransaction: any,
) => {
  if (!oldData) return oldData;

  const { type, transaction } = newTransaction;

  if (type === '[UPDATED]') {
    return {
      ...oldData,
      pages: oldData.pages.map((page: any) =>
        page.id === transaction.id ? transaction : page,
      ),
    };
  }

  return {
    ...oldData,
    pages: [transaction, ...oldData.pages[0].data],
  };
};
