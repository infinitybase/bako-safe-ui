import { create } from 'zustand';

import { AddressUtils } from '@/modules';

interface State {
  account: string;
  setAccount: (account: string) => void;
}

const useFuelAccount = create<State>((set) => ({
  account: '',
  formattedAccount: '',
  setAccount: (account) =>
    set((state) => ({
      account,
      formattedAccount: AddressUtils.format(state.account),
    })),
}));

export { useFuelAccount };
