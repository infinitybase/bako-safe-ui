import {
  defaultPermissions,
  type IPermission,
  type Member,
  PermissionRoles,
  type Workspace,
} from '@bako-safe/services';

type PermissionKey = keyof typeof PermissionRoles;

export type PermissionDetail = {
  role?: PermissionRoles;
  title: string;
  variant: string;
  description: string;
};

export type PermissionDetails = {
  [key in PermissionKey]: PermissionDetail;
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
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

  static permissionsValues: PermissionDetail[] = Object.keys(this.permissions)
    .filter(
      (permission) =>
        !this.hiddenPermissions.includes(permission as PermissionRoles),
    )
    .map((permission) => ({
      ...this.permissions[permission as PermissionRoles],
      value: permission,
    }));

  static getPermissionInWorkspace(
    workspace: Pick<Workspace, 'permissions'>,
    member: Pick<Member, 'id'>,
  ) {
    const permission = defaultPermissions[PermissionRoles.OWNER];

    if (!permission) return null;

    const permissionRole = Object.keys(permission).find((role) =>
      permission[role as keyof IPermission].includes('*'),
    );

    const permissionValue = {};

    if (!permissionValue) return null;

    return {
      ...permissionValue,
      role: permissionRole,
    } as PermissionDetail;
  }

  static hasPermissions(permissions: IPermission, roles: PermissionRoles[]) {
    const permissionRoles = Object.keys(permissions);
    const permission = roles.filter((role) => {
      return permissionRoles.includes(role) && permissions[role].includes('*');
    });

    return !!permission && !!permission.length;
  }

  static is(
    role: PermissionRoles,
    params: { permissions: IPermission; userId: string },
  ) {
    const permissionInWorkspace =
      WorkspacePermissionUtils.getPermissionInWorkspace(
        { permissions: params.permissions },
        { id: params.userId },
      );

    if (!permissionInWorkspace) return false;

    return permissionInWorkspace.role === role;
  }
}

export { WorkspacePermissionUtils };
