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
    staleTime: 500, // 500ms second to prevent request spam
  });

  const result = data
    ? data?.reduce<Record<string, { usdAmount: number }>>(
        (acc, [address, usdAmount]) => {
          acc[String(address)] = { usdAmount: Number(usdAmount) };
          return acc;
        },
        {},
      )
    : [Address.fromRandom().toString(), 0.0];

  return { data: result, ...query };
};

export { useTokensUSDAmountRequest };
