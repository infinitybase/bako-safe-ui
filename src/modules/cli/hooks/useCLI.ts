import { useMemo } from 'react';

import {
  BitCoinIcon,
  CoinsIcon,
  MoreLessIcon,
  RecoveryIcon,
} from '@/components';
import { useAuth } from '@/modules/auth';
import { PermissionRoles } from '@/modules/core/models';
import { UseVaultDetailsReturn } from '@/modules/vault/hooks';
import { useGetWorkspaceRequest } from '@/modules/workspace/hooks';

import { TabState, useAPIToken } from './APIToken';

export const requiredCLIRoles = [
  PermissionRoles.ADMIN,
  PermissionRoles.OWNER,
  PermissionRoles.MANAGER,
];

const useCLI = (vault: UseVaultDetailsReturn['vault']) => {
  const { userId } = useAuth();
  const { workspace } = useGetWorkspaceRequest(vault?.workspace?.id ?? '');

  const hasPermission = useMemo(() => {
    const memberPermission = workspace?.permissions[userId];
    const hasRequiredPermission =
      memberPermission &&
      requiredCLIRoles.filter((p) => (memberPermission[p] ?? []).includes('*'))
        .length > 0;

    const hasPerm = hasRequiredPermission;
    return hasPerm;
  }, [userId, vault, workspace]);

  const { dialog, steps, tabs, create, remove, list, hasToken } =
    useAPIToken(hasPermission);

  const settings = [
    {
      label: 'API Tokens',
      icon: CoinsIcon,
      disabled: !hasPermission,
      onClick: () => {
        hasToken ? tabs.set(TabState.LIST) : tabs.set(TabState.CREATE);
        create.dialog.onOpen();
      },
    },
    {
      label: 'Add other tokens',
      icon: BitCoinIcon,
      disabled: true,
      onClick: () => {},
    },
    {
      label: 'Recovery',
      icon: RecoveryIcon,
      disabled: true,
      onClick: () => {},
    },
    {
      label: 'Spend limit',
      icon: MoreLessIcon,
      disabled: true,
      onClick: () => {},
    },
  ];

  return {
    settings,
    hasPermission,
    APIToken: {
      dialog,
      steps,
      tabs,
      create,
      remove,
      list,
    },
  };
};

export { useCLI };
