import type {
  UpdateSettingsPayload,
  UpdateSettingsResponse,
} from '@bako-safe/services';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { settingsService } from '@/config/services-initializer';

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
