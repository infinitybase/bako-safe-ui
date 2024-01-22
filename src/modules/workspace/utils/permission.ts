import { PermissionRoles } from '@/modules/core';

interface PermissionDTO {
  title: string;
  variant: string;
  description: string;
  value: PermissionRoles;
}

class WorkspacePermissionUtils {
  static permissions = {
    [PermissionRoles.ADMIN]: {
      title: 'Admin',
      description:
        'Manage members, create new vaults, create transaction and access everything.',
      variant: 'success',
    },
    [PermissionRoles.MANAGER]: {
      title: 'Manager',
      description:
        'Can create new vaults, create transaction and access all vaults in the workspace.',
      variant: 'blue',
    },
    [PermissionRoles.VIEWER]: {
      title: 'Viewer',
      description:
        'Can only access and view the contents of all vaults in the workspace.',
      variant: 'warning',
    },
  };

  static permissionsValues: PermissionDTO[] = Object.keys(this.permissions).map(
    (permission) => ({
      ...this.permissions[permission],
      value: permission,
    }),
  );
}

export { WorkspacePermissionUtils };
