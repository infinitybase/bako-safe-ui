import { create } from 'zustand';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { AddressUtils } from '@/modules/core/utils/address';

interface State {
  account: string;
  formattedAccount: string;
  avatar: string;
  invalidAccount: boolean;
  setAccount: (account: string) => void;
  setAvatar: (avatar: string) => void;
  setInvalidAccount: (isInalid: boolean) => void;
}
const { ADDRESS, AVATAR } = CookieName;

const useFuelAccount = create<State>((set) => ({
  account: CookiesConfig.getCookie(ADDRESS)!,
  formattedAccount: AddressUtils.format(CookiesConfig.getCookie(ADDRESS)!)!,
  avatar: CookiesConfig.getCookie(AVATAR)!,
  invalidAccount: false,
  setInvalidAccount: (invalidAccount) => set({ invalidAccount }),
  setAvatar: (avatar) => set({ avatar }),
  setAccount: (account) =>
    set({
      account,
      formattedAccount: AddressUtils.format(account),
    }),
}));

export { useFuelAccount };
