import { useQuery } from 'react-query';

import { HomeService } from '../services';

const useTokensUSDAmountRequest = () => {
  return useQuery(['tokens'], () => HomeService.getTokensUSDAmount(), {
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 10,
  });
};

export { useTokensUSDAmountRequest };
