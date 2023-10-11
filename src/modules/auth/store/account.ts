import { create } from 'zustand';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { AddressUtils } from '@/modules';

interface State {
  account: string;
  formattedAccount: string;
  avatar: string;
  setAccount: (account: string) => void;
  setAvatar: (avatar: string) => void;
}
const { ADDRESS, AVATAR } = CookieName;

const useFuelAccount = create<State>((set) => ({
  account: CookiesConfig.getCookie(ADDRESS)!,
  formattedAccount: AddressUtils.format(CookiesConfig.getCookie(ADDRESS)!)!,
  avatar: CookiesConfig.getCookie(AVATAR)!,
  setAvatar: (avatar) => set({ avatar }),
  setAccount: (account) =>
    set({
      account,
      formattedAccount: AddressUtils.format(account),
    }),
}));

export { useFuelAccount };
