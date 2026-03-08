import { create } from 'zustand';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';

interface TransactionState {
  selectedTransaction: { id?: string };
  setSelectedTransaction: (transaction: { id?: string }) => void;
}

export const useTransactionState = create<TransactionState>((set) => ({
  selectedTransaction: {},
  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
}));