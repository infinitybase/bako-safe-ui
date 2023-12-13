import { useMutation, UseMutationOptions } from 'react-query';

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
  return useMutation(
    'settings/update',
    SettingsService.updateSettings,
    options,
  );
};

export { useUpdateSettingsRequest };
