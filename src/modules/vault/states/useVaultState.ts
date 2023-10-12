import { create } from 'zustand';

import { Asset } from '../../core/utils/assets/types';

interface State {
  biggerAsset: Asset | null;
  setBiggerAsset: (asset: Asset | null) => void;
  visebleBalance: boolean;
  setVisibleBalance: (visible: boolean) => void;
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
}

const useVaultState = create<State>((set) => ({
  biggerAsset: null,
  setBiggerAsset: (asset) => set({ biggerAsset: asset }),
  visebleBalance: false,
  setVisibleBalance: (visible) => set({ visebleBalance: visible }),
  assets: [],
  setAssets: (assets) => set({ assets }),
}));

export { useVaultState };
