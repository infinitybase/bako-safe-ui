import { create } from 'zustand';

import { AddressUtils } from '@/modules';

interface State {
  account: string;
  formattedAccount: string;
  setAccount: (account: string) => void;
}

const useFuelAccount = create<State>((set) => ({
  account: '',
  formattedAccount: '',
  setAccount: (account) =>
    set({
      account,
      formattedAccount: AddressUtils.format(account),
    }),
}));

export { useFuelAccount };
