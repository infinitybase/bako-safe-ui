import { create } from 'zustand';

import { Asset } from '../../core/utils/assets/types';

const IS_VISIBLE_KEY = '@bsafe/balance-is-visible';

const isVisibleBalance = () => localStorage.getItem(IS_VISIBLE_KEY) === 'true';
const setIsVisibleBalance = (isVisible: 'true' | 'false') =>
  localStorage.setItem(IS_VISIBLE_KEY, isVisible);

interface State {
  biggerAsset: Asset | null;
  setBiggerAsset: (asset: Asset | null) => void;
  visebleBalance: boolean;
  setVisibleBalance: (visible: boolean) => void;
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  balanceUSD: string;
  setBalanceUSD: (balance: string) => void;
}

const useVaultState = create<State>((set) => ({
  biggerAsset: null,
  setBiggerAsset: (asset) => set({ biggerAsset: asset }),
  visebleBalance: isVisibleBalance(),
  setVisibleBalance: (visible) => {
    set({ visebleBalance: visible });
    setIsVisibleBalance(visible ? 'true' : 'false');
  },
  assets: [],
  balanceUSD: '0.00',
  setBalanceUSD: (balance) => set({ balanceUSD: balance }),
  setAssets: (assets) => set({ assets }),
}));

export { useVaultState };
