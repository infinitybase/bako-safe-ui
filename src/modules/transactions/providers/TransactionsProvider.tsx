import { createContext, useContext } from 'react';

import {
  IuseTransactionDetails,
  useTransactionDetails,
} from '../hooks/context/useTransactionDetails';

const TransactionsContext = createContext<IuseTransactionDetails | null>(null);

const TransactionsProvider = ({ children }: { children: React.ReactNode }) => {
  const transactionsDetails = useTransactionDetails();

  return (
    <TransactionsContext.Provider value={transactionsDetails}>
      {children}
    </TransactionsContext.Provider>
  );
};
export default TransactionsProvider;

const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      'useTransactionsContext must be used within TransactionsProvider',
    );
  }

  return context;
};

export { TransactionsProvider, useTransactionsContext };
