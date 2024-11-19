import { useQuery } from '@tanstack/react-query';
import { Address } from 'fuels';

import { homeService } from '@/config/services-initializer';
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
    queryFn: () => homeService.getTokensUSDAmount(),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 10,
    // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });

  const isUnknownToken = (assetId: string) =>
    !!data?.filter((token) => token[0] === assetId);

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
