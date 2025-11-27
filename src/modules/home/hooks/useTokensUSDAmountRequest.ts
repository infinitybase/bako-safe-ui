import { useQuery } from '@tanstack/react-query';
import { Address } from 'fuels';

import { HomeService } from '../services';
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isUnknownToken = (assetId: string) =>
    !!data?.filter((token) => token[assetId]);

  const response = data ?? [[Address.fromRandom().toString(), 0.0]];

  const result = response?.reduce<Record<string, { usdAmount: number }>>(
    (acc, [address, usdAmount]) => {
      acc[String(address)] = { usdAmount: Number(usdAmount) };
      return acc;
    },
    {},
  );

  return { data: result, isUnknownToken, ...query };
};

export { useTokensUSDAmountRequest };
