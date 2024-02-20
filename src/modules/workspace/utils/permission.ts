import {
  IPermission,
  Member,
  PermissionRoles,
  Workspace,
} from '@/modules/core/models';

interface PermissionDTO {
  title: string;
  variant: string;
  description: string;
  value: PermissionRoles;
}

type PermissionKey = keyof typeof PermissionRoles;

type PermissionDetails = {
  [key in PermissionKey]: {
    title: string;
    variant: string;
    description: string;
  };
};

class WorkspacePermissionUtils {
  static hiddenPermissions = [PermissionRoles.OWNER, PermissionRoles.SIGNER];

  static permissions: PermissionDetails = {
    [PermissionRoles.OWNER]: {
      title: 'Owner',
      description: '',
      variant: 'success',
    },
    [PermissionRoles.SIGNER]: {
      title: 'Signer',
      description: '',
      variant: 'warning',
    },
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
      variant: 'yellow',
    },
    [PermissionRoles.VIEWER]: {
      title: 'Viewer',
      description:
        'Can only access and view the contents of all vaults in the workspace.',
      variant: 'blue',
    },
  };

  static permissionsValues: PermissionDTO[] = Object.keys(this.permissions)
    .filter(
      (permission) =>
        !this.hiddenPermissions.includes(permission as PermissionRoles),
    )
    .map((permission) => ({
      ...this.permissions[permission],
      value: permission,
    }));

  static getPermissionInWorkspace(workspace: Workspace, member: Member) {
    const permission = workspace?.permissions[member.id];

    if (!permission) return null;

    const permissionRole = Object.keys(permission)
      .filter((role) => permission[role].includes('*'))
      .at(0);
    const permissionValue = this.permissions[permissionRole || ''];

    if (!permissionValue) return null;

    return permissionValue;
  }

  static hasPermissions(permissions: IPermission, roles: PermissionRoles[]) {
    const permissionRoles = Object.keys(permissions);
    const permission = roles.filter((role) => {
      return permissionRoles.includes(role) && permissions[role].includes('*');
    });

    return !!permission && !!permission.length;
  }
}

export { WorkspacePermissionUtils };
