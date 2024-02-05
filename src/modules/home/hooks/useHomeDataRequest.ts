import { useQuery } from 'react-query';

import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';

const useHomeDataRequest = () => {
  return useQuery(HomeQueryKey.FULL_DATA(), () => HomeService.home(), {
    refetchOnWindowFocus: false,
  });
};

export { useHomeDataRequest };
