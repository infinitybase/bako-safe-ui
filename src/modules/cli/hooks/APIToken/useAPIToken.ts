import { useMemo, useState } from 'react';

import { useGetParams } from '@/modules';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

import { useCreateAPIToken } from './create';
import { useListAPITokens } from './list';
import { useRemoveAPIToken } from './remove';

export enum TabState {
  LIST,
  CREATE,
  SUCCESS,
}

export type UseAPITokenReturn = ReturnType<typeof useAPIToken>;

const useAPIToken = (hasPermission: boolean) => {
  const {
    vaultPageParams: { vaultId },
  } = useGetParams();
  const [tab, setTab] = useState<TabState>(TabState.LIST);

  const dialog = useDisclosure();

  const {
    form,
    request: createRequest,
    createdAPIKey,
  } = useCreateAPIToken(setTab);
  const { request: listRequest } = useListAPITokens(vaultId!, hasPermission);
  const { confirm, request: removeRequest, handler } = useRemoveAPIToken();

  const hasToken = useMemo(() => {
    return listRequest.data && listRequest.data?.length > 0;
  }, [listRequest]);

  const handleCloseDialog = () => {
    setTab(TabState.LIST);
    dialog.onClose();
    createdAPIKey.set('');
    form.reset();
  };

  const stepsActions = {
    [TabState.LIST]: {
      title: 'API Tokens',
      description:
        'Send single or batch payments with multi assets. You can send multiple types of assets to different addresses.',
      primaryAction: {
        handler: () => {},
        label: '',
        disabled: true,
        hide: true,
        isLoading: false,
      },
      secondaryAction: {
        handler: handleCloseDialog,
        label: 'Done',
      },
      hideHeader: false,
    },
    [TabState.CREATE]: {
      title: 'Create new API Tokens',
      description:
        'Define the name and description of this vault. These details will be visible to all members.',
      primaryAction: {
        handler: () => form.submit(),
        label: 'Next',
        disabled: false,
        hide: false,
        isLoading: createRequest.isLoading,
      },
      secondaryAction: {
        handler: handleCloseDialog,
        label: 'Cancel',
      },
      hideHeader: false,
    },
    [TabState.SUCCESS]: {
      title: 'API Token created!',
      description:
        'You will not have another chance to copy this keys. Make sure you are saving in a safe place',
      primaryAction: {
        handler: () => {},
        label: 'Done',
        disabled: false,
        hide: true,
        isLoading: false,
      },
      secondaryAction: {
        handler: handleCloseDialog,
        label: 'Done',
      },
      hideHeader: true,
    },
  };

  return {
    dialog: {
      ...dialog,
      onClose: handleCloseDialog,
    },
    steps: {
      step: stepsActions[tab],
      actions: stepsActions,
    },
    tabs: {
      tab,
      set: setTab,
    },
    list: {
      request: listRequest,
    },
    create: {
      request: createRequest,
      dialog,
      form,
      createdAPIKey,
    },
    remove: {
      confirm,
      request: removeRequest,
      handler,
    },
    hasToken,
  };
};

export { useAPIToken };
