import { AssetId, tokensIDS } from '@/modules/core/utils/assets/address';
import { create } from 'zustand';

interface TokenState {
  tokens: {
    [assetId in AssetId]: {
      usdAmount: number;
    };
  };
  setTokenCurrentAmount: (tokenData: [AssetId, number][]) => void;
}

const useTokensStore = create<TokenState>((set) => ({
  tokens: {
    [AssetId.BTC]: {
      usdAmount: 0,
    },
    [AssetId.ETH]: {
      usdAmount: 0,
    },
    [AssetId.USDC]: {
      usdAmount: 0,
    },
    [AssetId.UNI]: {
      usdAmount: 0,
    },
    [AssetId.DAI]: {
      usdAmount: 0,
    },
    [AssetId.sETH]: {
      usdAmount: 0,
    },
  },
  setTokenCurrentAmount: (tokenData) => {
    set((state) => {
      const newTokens = { ...state.tokens };

      tokenData.forEach(([assetId, amount]) => {
        if (newTokens[assetId]) {
          newTokens[assetId].usdAmount = amount;
        }
      });

      return { tokens: newTokens };
    });
  },
}));

export { useTokensStore };
