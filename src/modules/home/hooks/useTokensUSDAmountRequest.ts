import { useQuery } from '@tanstack/react-query';

import { useTokensStore } from '@/modules/assets-tokens/store/useTokensStore';

import { HomeService } from '../services';

const useTokensUSDAmountRequest = () => {
  const { setTokenCurrentAmount, setIsLoading } = useTokensStore();

  return useQuery({
    queryKey: ['tokens'],
    queryFn: () => HomeService.getTokensUSDAmount(),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 10,
    onSuccess: (data) => {
      setTokenCurrentAmount(data ?? []);
      setIsLoading(false);
    },
  });
};

export { useTokensUSDAmountRequest };
