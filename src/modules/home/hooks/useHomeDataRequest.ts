import { useQuery } from 'react-query';

import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';

const useHomeDataRequest = () => {
  return useQuery(HomeQueryKey.FULL_DATA(), () => HomeService.home(), {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, //15 minutes with fresh data
  });
};

export { useHomeDataRequest };
