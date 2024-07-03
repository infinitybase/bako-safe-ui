import { useQuery } from 'react-query';

import { HomeService } from '../services';

const useTokensUSDAmountRequest = () => {
  return useQuery(['tokens'], () => HomeService.getTokensUSDAmount(), {
    refetchOnWindowFocus: false,
    refetchInterval: 600000,
  });
};

export { useTokensUSDAmountRequest };
