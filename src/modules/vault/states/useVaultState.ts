import { create } from 'zustand';

import { Asset } from '../../core/utils/assets/types';

interface State {
  biggerAsset: Asset;
  setBiggerAsset: (asset: Asset) => void;
  visebleBalance: boolean;
  setVisibleBalance: (visible: boolean) => void;
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
}

const useVaultState = create<State>((set) => ({
  biggerAsset: {} as Asset,
  setBiggerAsset: (asset) => set({ biggerAsset: asset }),
  visebleBalance: false,
  setVisibleBalance: (visible) => set({ visebleBalance: visible }),
  assets: [],
  setAssets: (assets) => set({ assets }),
}));

export { useVaultState };
