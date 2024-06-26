import { useAuth } from '@/modules/auth';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';

import { PermissionRoles, Workspace } from '../models';

interface usePermissionsProps {
  id: string;
  workspace: Workspace;
}

export const usePermissions = ({ id, workspace }: usePermissionsProps) => {
  const auth = useAuth();
  const userRole = WorkspacePermissionUtils.getPermissionInWorkspace(
    workspace!,
    {
      id: auth.userId,
    },
  );

  const permissions =
    userRole?.role && WorkspacePermissionUtils.permissions[userRole.role];

  if (!permissions) {
    return {
      isSigner: false,
      isViewer: false,
      isAdmin: false,
      isManager: false,
      role: PermissionRoles.SIGNER,
    };
  }

  const isOwner =
    workspace.permissions[auth.userId][PermissionRoles.OWNER]?.includes('*');
  const isSigner =
    workspace.permissions[auth.userId][PermissionRoles.SIGNER]?.includes(id);

  const isViewer =
    permissions?.title ===
    WorkspacePermissionUtils.permissions[PermissionRoles.VIEWER].title;
  const isAdmin =
    permissions?.title ===
    WorkspacePermissionUtils.permissions[PermissionRoles.ADMIN].title;
  const isManager =
    permissions?.title ===
    WorkspacePermissionUtils.permissions[PermissionRoles.MANAGER].title;

  const role = isOwner
    ? PermissionRoles.OWNER
    : isSigner
    ? PermissionRoles.SIGNER
    : userRole?.title?.toUpperCase() ?? PermissionRoles.SIGNER;

  return {
    isSigner: true,
    isViewer,
    isAdmin,
    isManager,
    role,
  };
};
