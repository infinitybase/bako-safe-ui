import { useQuery } from '@tanstack/react-query';

import { HomeService } from '../services';
import { tokensIDS } from '@/modules/core/utils/assets/address';

let tokens = {
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
};

export type IuseTokensUSDAmountRequestReturn = ReturnType<
  typeof useTokensUSDAmountRequest
>;

export type ITokens = {
  [x: string]: {
    usdAmount: number;
  };
};

const useTokensUSDAmountRequest = () => {
  const { data, ...query } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => HomeService.getTokensUSDAmount(),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 10,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });

  if (data) {
    data.forEach(([assetId, amount]) => {
      if (tokens[assetId]) {
        tokens[assetId].usdAmount = amount;
      }
    });
  }

  return { data: tokens, ...query };
};

export { useTokensUSDAmountRequest };
