import { useQuery } from '@tanstack/react-query';

import { settingsService } from '@/config/services-initializer';

import { SettingsQueryKey } from '../utils';

const useMySettingsRequest = (account: string) => {
  return useQuery({
    queryKey: [SettingsQueryKey.MY_SETTINGS, account],
    queryFn: async () => settingsService.getSettings(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export { useMySettingsRequest };
