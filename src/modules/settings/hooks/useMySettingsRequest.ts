import { useQuery } from 'react-query';

import { SettingsQueryKey } from '@/modules/core';

import { SettingsService } from '../services';

const useMySettingsRequest = (account: string) => {
  return useQuery(
    [SettingsQueryKey.MY_SETTINGS, account],
    async () => SettingsService.getSettings(),
    {
      refetchOnWindowFocus: false,
    },
  );
};

export { useMySettingsRequest };
