import { useQuery } from '@tanstack/react-query';

import { HomeService } from '../services';
import { Address } from 'fuels';
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
    initialData: [[Address.fromRandom().toString(), 0.0]],
  });

  const result = data?.reduce<Record<string, { usdAmount: number }>>(
    (acc, [address, usdAmount]) => {
      acc[String(address)] = { usdAmount: Number(usdAmount) };
      return acc;
    },
    {},
  );

  return { data: result, ...query };
};

export { useTokensUSDAmountRequest };
