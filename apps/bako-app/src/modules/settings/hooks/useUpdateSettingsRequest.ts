import {
  UpdateSettingsPayload,
  UpdateSettingsResponse,
} from '@bako-safe/services/modules/settings';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { settingsService } from '@/modules/services/services-initializer';

const useUpdateSettingsRequest = (
  options?: UseMutationOptions<
    UpdateSettingsResponse,
    unknown,
    UpdateSettingsPayload
  >,
) => {
  return useMutation({
    mutationKey: ['settings/update'],
    mutationFn: settingsService.updateSettings,
    ...options,
  });
};

export { useUpdateSettingsRequest };
