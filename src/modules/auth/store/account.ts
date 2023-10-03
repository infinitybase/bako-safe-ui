import { create } from 'zustand';

interface State {
  account: string;
  setAccount: (account: string) => void;
}

const format = (address: string) => {
  return `${address.slice(0, 10)}...${address.slice(-5)}`;
};

const useFuelAccount = create<State>((set) => ({
  account: '',
  formattedAccount: '',
  setAccount: (account) =>
    set((state) => ({
      account,
      formattedAccount: format(state.account),
    })),
}));

export { useFuelAccount };
