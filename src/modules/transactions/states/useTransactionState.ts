import { create } from 'zustand';

import { TransactionRedirect } from '@/modules/notifications/hooks';

interface State {
  selectedTransaction: TransactionRedirect;
  setSelectedTransaction: (selectedTransaction: TransactionRedirect) => void;
}

const useTransactionState = create<State>((set) => ({
  selectedTransaction: {},
  setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),
}));

export { useTransactionState };
