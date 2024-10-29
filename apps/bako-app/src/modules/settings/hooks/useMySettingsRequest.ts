import { SettingsService } from '@bako-safe/services/modules/settings';
import { useQuery } from '@tanstack/react-query';

import { SettingsQueryKey } from '../utils';

const useMySettingsRequest = (account: string) => {
  return useQuery({
    queryKey: [SettingsQueryKey.MY_SETTINGS, account],
    queryFn: async () => SettingsService.getSettings(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export { useMySettingsRequest };
