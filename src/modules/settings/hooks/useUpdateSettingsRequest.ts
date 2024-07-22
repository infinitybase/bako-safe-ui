import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  SettingsService,
  UpdateSettingsPayload,
  UpdateSettingsResponse,
} from '../services';

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
