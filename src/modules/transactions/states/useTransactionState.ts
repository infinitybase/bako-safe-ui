import { create } from 'zustand';

export interface SelectedTransaction {
  id?: string;
  name?: string;
}

interface State {
  selectedTransaction: SelectedTransaction;
  setSelectedTransaction: (selectedTransaction: SelectedTransaction) => void;
}

const useTransactionState = create<State>((set) => ({
  selectedTransaction: {},
  setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),
}));

export { useTransactionState };
