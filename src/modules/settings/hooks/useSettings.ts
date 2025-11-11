import { AxiosError } from 'axios';
import { useEffect } from 'react';

import { IApiError, queryClient } from '@/config';
import { useContactToast } from '@/modules/addressBook';
import { SettingsQueryKey } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useUpdateSettingsRequest } from './';
import { useMySettingsRequest } from './useMySettingsRequest';
import { useSettingsForm } from './useSettingsForm';

interface UseSettingsProps {
  onOpen?: () => void;
  onClose?: () => void;
}

const useSettings = ({ onClose }: UseSettingsProps) => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();
  const { form } = useSettingsForm();
  const { successToast, errorToast } = useContactToast();
  const mySettingsRequest = useMySettingsRequest(userInfos.address);
  const updateSettingsRequest = useUpdateSettingsRequest();

  const user = mySettingsRequest.data;
  const firstLogin = user?.first_login;

  const onCloseDrawer = () => {
    onClose?.();

    if (firstLogin && user) {
      updateSettingsRequest.mutate(
        { first_login: false, id: user.id },
        {
          onSuccess: () =>
            queryClient.invalidateQueries({
              queryKey: [SettingsQueryKey.MY_SETTINGS],
            }),
        },
      );
    }

    form.reset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      notify: String(user?.notify ?? '') ?? 'false',
    });
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
            queryClient.invalidateQueries({
              queryKey: [SettingsQueryKey.MY_SETTINGS],
            });
            onClose?.();
            successToast({
              title: 'Settings updated',
              description: 'Your settings have been updated successfully.',
            });
          },
          onError: (error) => {
            const errorDescription = (
              (error as AxiosError)?.response?.data as IApiError
            )?.detail;
            const description =
              errorDescription?.includes('name') &&
              errorDescription?.includes('already exists')
                ? 'This name is already being used'
                : 'An error occurred while updating your settings';

            errorToast({
              title: 'Error on update settings',
              description,
            });
          },
        },
      );
    }
  });

  useEffect(() => {
    // if (firstLogin) onOpen?.();

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
