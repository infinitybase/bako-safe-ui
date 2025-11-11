import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { PermissionRoles } from '../models/workspace';

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
