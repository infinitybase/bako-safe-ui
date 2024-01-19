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

export interface Member {
  name: string | null;
  avatar: string;
  address: string;
}

export interface Owner extends Member {}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  avatar: string;
  permissions: IPermissions;
  single: boolean;
  owner: Owner;
  members: Member[];
  predicates: number;
}

export enum WorkspacesQueryKey {
  LIST_BY_USER = 'workspaces/list-by-user',
  SELECT = 'workspaces/select',
}
