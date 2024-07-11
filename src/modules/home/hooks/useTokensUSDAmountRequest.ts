import { useQuery } from 'react-query';

import { HomeService } from '../services';
import { useTokensStore } from '@/modules/assets-tokens/store/useTokensStore';

const useTokensUSDAmountRequest = () => {
  const { setTokenCurrentAmount, setIsLoading } = useTokensStore();

  return useQuery(['tokens'], () => HomeService.getTokensUSDAmount(), {
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
    staleTime: 1000 * 60 * 10,
    onSuccess: (data) => {
      setTokenCurrentAmount(data ?? []);
      setIsLoading(false);
    },
  });
};

export { useTokensUSDAmountRequest };
