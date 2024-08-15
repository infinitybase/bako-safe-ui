import { useQuery } from '@tanstack/react-query';

import { SettingsQueryKey } from '@/modules/core';

import { SettingsService } from '../services';

const useMySettingsRequest = (account: string) => {
  return useQuery({
    queryKey: [SettingsQueryKey.MY_SETTINGS, account],
    queryFn: async () => SettingsService.getSettings(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export { useMySettingsRequest };
