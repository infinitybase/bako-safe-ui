import { create } from 'zustand';

import { TransactionRedirect } from '@/modules/notifications/hooks';

interface State {
  selectedTransaction: TransactionRedirect;
  setSelectedTransaction: (selectedTransaction: TransactionRedirect) => void;
  isCurrentTxPending: {
    isPending: boolean;
    transactionId: string;
  };
  setIsCurrentTxPending: (isCurrentTxPending: {
    isPending: boolean;
    transactionId: string;
  }) => void;
}

const useTransactionState = create<State>((set) => ({
  selectedTransaction: {},
  setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),
  isCurrentTxPending: {
    isPending: false,
    transactionId: '',
  },
  setIsCurrentTxPending: (isCurrentTxPending) => set({ isCurrentTxPending }),
}));

export { useTransactionState };
