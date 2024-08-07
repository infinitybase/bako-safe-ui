import { tokensIDS } from '@/modules/core/utils/assets/address';
import { create } from 'zustand';

interface TokenState {
  tokens: {
    [assetId: string]: {
      usdAmount: number;
    };
  };
  isLoading: boolean;
  setTokenCurrentAmount: (tokenData: [string, number][]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const useTokensStore = create<TokenState>((set) => ({
  tokens: {
    [tokensIDS.ETH]: {
      usdAmount: 0,
    },
    [tokensIDS.BTC]: {
      usdAmount: 0,
    },
    [tokensIDS.USDC]: {
      usdAmount: 0,
    },
    [tokensIDS.UNI]: {
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

  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export { useTokensStore };
