import { create } from 'zustand';

import { TransactionRedirect } from '@/modules/notifications/hooks';

interface State {
  selectedTransaction: TransactionRedirect;
  setSelectedTransaction: (selectedTransaction: TransactionRedirect) => void;
  isCurrentTxPending: boolean;
  setIsCurrentTxPending: (isCurrentTxPending: boolean) => void;
}

const useTransactionState = create<State>((set) => ({
  selectedTransaction: {},
  setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),
  isCurrentTxPending: false,
  setIsCurrentTxPending: (isCurrentTxPending) => set({ isCurrentTxPending }),
}));

export { useTransactionState };
