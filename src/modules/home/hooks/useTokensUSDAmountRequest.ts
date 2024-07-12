import { useQuery } from '@tanstack/react-query';

import { useTokensStore } from '@/modules/assets-tokens/store/useTokensStore';

import { HomeService } from '../services';

const useTokensUSDAmountRequest = () => {
  const { setTokenCurrentAmount, setIsLoading } = useTokensStore();

  return useQuery({
    queryKey: ['tokens'],
    queryFn: () =>
      HomeService.getTokensUSDAmount().then((data) => {
        setTokenCurrentAmount(data ?? []);
        setIsLoading(false);
        return data;
      }),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 10,
  });
};

export { useTokensUSDAmountRequest };
