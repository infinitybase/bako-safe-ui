import { useEffect } from 'react';

import { queryClient } from '@/config';
import { useAuthStore } from '@/modules/auth';
import { SettingsQueryKey } from '@/modules/core';

import { useUpdateSettingsRequest } from './';
import { useMySettingsRequest } from './useMySettingsRequest';
import { useSettingsForm } from './useSettingsForm';
import { useSettingsToast } from './useSettingsToast';

interface UseSettingsProps {
  onOpen?: () => void;
  onClose?: () => void;
}

const { MY_SETTINGS } = SettingsQueryKey;

const useSettings = ({ onOpen, onClose }: UseSettingsProps) => {
  const { account } = useAuthStore();
  const { form } = useSettingsForm();
  const { successToast } = useSettingsToast();
  const mySettingsRequest = useMySettingsRequest(account);
  const updateSettingsRequest = useUpdateSettingsRequest();

  const user = mySettingsRequest.data;
  const firstLogin = user?.first_login;

  const onCloseDrawer = () => {
    onClose?.();

    if (firstLogin && user) {
      updateSettingsRequest.mutate(
        { first_login: false, id: user.id },
        { onSuccess: () => queryClient.invalidateQueries([MY_SETTINGS]) },
      );
    }

    form.setValue('name', user?.name ?? '');
    form.setValue('email', user?.email ?? '');
    form.setValue('notify', String(user?.notify ?? '') ?? 'false');
  };

  const handleSubmitSettings = form.handleSubmit(async (data) => {
    if (user) {
      updateSettingsRequest.mutate(
        {
          ...data,
          id: user.id,
          notify: data?.notify ?? 'false',
          ...(firstLogin ? { first_login: false } : {}),
        },
        {
          onSuccess: async () => {
            queryClient.invalidateQueries([MY_SETTINGS]);
            onClose?.();
            successToast({
              title: 'Settings updated',
              description: 'Your settings have been updated successfully.',
            });
          },
        },
      );
    }
  });

  useEffect(() => {
    if (firstLogin) onOpen?.();

    // TODO: Move this to field values
    form.setValue('name', user?.name ?? '');
    form.setValue('email', user?.email ?? '');
    form.setValue('notify', String(user?.notify ?? '') ?? 'false');
  }, [firstLogin, user]);

  return {
    handleSubmitSettings,
    mySettingsRequest,
    updateSettingsRequest,
    form,
    onCloseDrawer,
  };
};

export { useSettings };
