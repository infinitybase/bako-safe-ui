import { useQuery } from 'react-query';

import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';

const useHomeDataRequest = () => {
  return useQuery(HomeQueryKey.DEFAULT, () => HomeService.home(), {
    refetchOnWindowFocus: false,
  });
};

export { useHomeDataRequest };
