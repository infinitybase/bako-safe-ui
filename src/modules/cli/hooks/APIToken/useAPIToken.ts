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
    createdAPIKeyName,
    createdAPIKeyTransactionTitle,
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

  const handleTabListDialog = () => {
    setTab(TabState.LIST);
    createdAPIKey.set('');
    form.reset();
  }

  const stepsActions = {
    [TabState.LIST]: {
      title: 'API Tokens',
      description:
        'Manage your API tokens for secure access and control in the multisig system.',
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
      title: 'API Tokens',
      description:
        'Manage your API tokens for secure access and control in the multisig system.',
      primaryAction: {
        handler: () => form.submit(),
        label: 'Create API Token',
        disabled: false,
        hide: false,
        isLoading: createRequest.isLoading,
      },
      secondaryAction: {
        handler: handleTabListDialog,
        label: 'Cancel',
      },
      hideHeader: false,
    },
    [TabState.SUCCESS]: {
      title: '',
      description:
        '',
      primaryAction: {
        handler: handleTabListDialog,
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
      createdAPIKeyName,
      createdAPIKeyTransactionTitle,
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
