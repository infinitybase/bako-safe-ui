import { PermissionRoles } from '@bako-safe/services';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const usePermissions = (vaultOwnerId: string) => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  const isOwner = userInfos.id === vaultOwnerId;
  const role = isOwner ? PermissionRoles.OWNER : PermissionRoles.SIGNER;

  return {
    role,
  };
};

export { usePermissions };
