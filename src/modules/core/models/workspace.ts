export enum PermissionRoles {
  OWNER = 'OWNER', // owner of the workspace, THIS ROLE CAN'T BE CHANGED
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SIGNER = 'SIGNER',
  VIEWER = 'VIEWER',
}

export interface IPermissions {
  [key: string]: {
    [key in PermissionRoles]: string[];
  };
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  avatar: string;
  permissions: IPermissions;
  single: boolean;
}

export enum WorkspacesQueryKey {
  BY_USER = 'workspaces/by-user',
}
