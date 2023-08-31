import { create } from 'zustand';

interface State {
  account: string;
  setAccount: (account: string) => void;
}

const useFuelAccount = create<State>((set) => ({
  account: '',
  setAccount: (account) => set({ account }),
}));

export { useFuelAccount };
