import { create } from 'zustand';

import { Asset } from '../../core/utils/assets/types';

const IS_VISIBLE_KEY = '@bakosafe/balance-is-visible';

const isVisibleBalance = () => localStorage.getItem(IS_VISIBLE_KEY) === 'true';
const setIsVisibleBalance = (isVisible: 'true' | 'false') =>
  localStorage.setItem(IS_VISIBLE_KEY, isVisible);

interface State {
  visebleBalance: boolean;
  setVisibleBalance: (visible: boolean) => void;
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  balanceUSD: string;
  setBalanceUSD: (balance: string) => void;
  isFirstAssetsLoading: boolean;
  setIsFirstAssetsLoading: (isFirstAssetsLoading: boolean) => void;
  disableScroll: boolean;
  setDisableScroll: (disableScroll: boolean) => void;
}

const useVaultState = create<State>((set) => ({
  visebleBalance: isVisibleBalance(),
  setVisibleBalance: (visible) => {
    set({ visebleBalance: visible });
    setIsVisibleBalance(visible ? 'true' : 'false');
  },
  assets: [],
  balanceUSD: '0.00',
  setBalanceUSD: (balance) => set({ balanceUSD: balance }),
  setAssets: (assets) => set({ assets }),
  isFirstAssetsLoading: true,
  setIsFirstAssetsLoading: (isFirstAssetsLoading) =>
    set({ isFirstAssetsLoading }),

  disableScroll: false,
  setDisableScroll: (disableScroll) => set({ disableScroll }),
}));

export { useVaultState };
