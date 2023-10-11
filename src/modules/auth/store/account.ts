import { create } from 'zustand';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { AddressUtils } from '@/modules';

interface State {
  account: string;
  formattedAccount: string;
  setAccount: (account: string) => void;
}
const { ADDRESS } = CookieName;

const useFuelAccount = create<State>((set) => ({
  account: CookiesConfig.getCookie(ADDRESS)!,
  formattedAccount: AddressUtils.format(CookiesConfig.getCookie(ADDRESS)!)!,
  setAccount: (account) =>
    set({
      account,
      formattedAccount: AddressUtils.format(account),
    }),
}));

export { useFuelAccount };
