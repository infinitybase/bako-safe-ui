import { useMemo } from 'react';

import { PermissionRoles } from '@/modules/core/models/workspace';
import { useVaultDrawer } from '@/modules/vault/components/modal/hook';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useUserVaults = () => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  const {
    request: { vaults, ...rest },
    inView,
  } = useVaultDrawer({ orderByRoot: true });

  const userValidVaults = useMemo(() => {
    return vaults.filter(({ workspace }) => {
      return !WorkspacePermissionUtils.is(PermissionRoles.VIEWER, {
        permissions: workspace.permissions,
        userId: userInfos?.id,
      });
    });
  }, [vaults, userInfos?.id]);

  return {
    request: {
      vaults: userValidVaults,
      ...rest,
    },
    inView,
  };
};

export { useUserVaults };
