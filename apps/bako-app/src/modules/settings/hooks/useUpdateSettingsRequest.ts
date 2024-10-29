import {
  SettingsService,
  UpdateSettingsPayload,
  UpdateSettingsResponse,
} from '@bako-safe/services/modules/settings';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

const useUpdateSettingsRequest = (
  options?: UseMutationOptions<
    UpdateSettingsResponse,
    unknown,
    UpdateSettingsPayload
  >,
) => {
  return useMutation({
    mutationKey: ['settings/update'],
    mutationFn: SettingsService.updateSettings,
    ...options,
  });
};

export { useUpdateSettingsRequest };
