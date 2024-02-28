import { useAuth } from '@/modules/auth';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';

import { Member, PermissionRoles, Workspace } from '../models';

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
    } as Member,
  );

  const permissions =
    WorkspacePermissionUtils.permissions[userRole?.title?.toUpperCase()];

  const isSigner = workspace.permissions[auth.userId].SIGNER.includes(id);

  const isViewer =
    permissions?.title ===
    WorkspacePermissionUtils.permissions[PermissionRoles.VIEWER].title;
  const isAdmin =
    permissions.title ===
    WorkspacePermissionUtils.permissions[PermissionRoles.ADMIN].title;
  const isManager = (permissions.title =
    WorkspacePermissionUtils.permissions[PermissionRoles.MANAGER].title);

  const role =
    (isViewer && isSigner) || (isAdmin && isSigner) || (isManager && isSigner)
      ? PermissionRoles.SIGNER
      : userRole?.title?.toUpperCase() ?? PermissionRoles.SIGNER;

  return {
    isSigner,
    isViewer,
    isAdmin,
    isManager,
    role,
  };
};
