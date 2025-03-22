export const useTransactionsInfinityQueryCreateAndUpdate = (
  oldData: any,
  newTransaction: any,
) => {
  if (!oldData) return oldData;

  const { type, transaction } = newTransaction;
  const { pageParams, pages } = oldData;

  if (type === '[UPDATED]') {
    return {
      pageParams,
      pages: pages.map((page: any) =>
        page.data.some((item: any) => item.id === transaction.id)
          ? {
              ...page,
              data: page.data.map((item: any) =>
                item.id === transaction.id ? transaction : item,
              ),
            }
          : page,
      ),
    };
  }

  return {
    pageParams,
    pages: pages.map((page: any, index: number) =>
      index === 0 ? { ...page, data: [transaction, ...page.data] } : page,
    ),
  };
};
