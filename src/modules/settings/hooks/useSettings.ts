import { queryClient } from '@/config';
import { CookieName, CookiesConfig } from '@/config/cookies';
import { useSidebar } from '@/layouts/dashboard/hook';

import { useUpdateSettingsRequest } from './';
import { useSettingsForm } from './useSettingsForm';

interface UseAppNotificationsParams {
  onClose?: () => void;
  // isOpen?: boolean;
  // onSelect?: (vaultId: string) => void;
}

const useSettings = (props?: UseAppNotificationsParams) => {
  const { form } = useSettingsForm();
  const { drawer } = useSidebar();
  const updateSettingsRequest = useUpdateSettingsRequest({
    onSuccess: () => {
      onCloseDrawer();
      // deleteContactDialog.onClose();
      // invalidateQueries(['contacts/by-user']);
      // successToast({
      //   title: 'Success!',
      //   description: 'Your contact was deleted...',
      // });
    },
  });

  const onCloseDrawer = () => {
    props?.onClose?.();

    form.setValue('name', '');
    form.setValue('email', '');

    drawer.onClose();

    // TODO: Update field "first_login" to false (only if it is first login)

    queryClient.invalidateQueries([
      // NotificationsQueryKey.UNREAD_COUNTER,
      // NotificationsQueryKey.PAGINATED_LIST,
    ]);
  };

  const handleSubmitSettings = form.handleSubmit(async (data) => {
    updateSettingsRequest.mutate({
      ...data,
      notify: data.notify ?? 'false',
      id: CookiesConfig.getCookie(CookieName.USER_ID)!,
    });
  });

  return {
    handleSubmitSettings,
    updateSettingsRequest,
    form,
    drawer: {
      onClose: onCloseDrawer,
    },
  };
};

export { useSettings };
