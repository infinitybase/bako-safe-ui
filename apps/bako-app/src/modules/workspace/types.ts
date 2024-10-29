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

export type IPermission = {
  [key in PermissionRoles]: string[];
};

export interface Member {
  id: string;
  name: string | null;
  avatar: string;
  address: string;
}

export interface WorkspaceContact {
  id: string;
  nickname: string;
  user: { id: string; address: string; avatar: string };
}

export interface Owner extends Member {}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  avatar: string;
  permissions: IPermission;
  single: boolean;
  owner: Owner;
  members: Member[];
  predicates: number;
}

export interface WorkspaceOnVault {
  workspace: {
    id: string;
    addressBook: WorkspaceContact[];
  };
}

export const defaultPermissions = {
  [PermissionRoles.OWNER]: {
    OWNER: ['*'],
    ADMIN: [''],
    MANAGER: [''],
    SIGNER: [''],
    VIEWER: [''],
  },
  [PermissionRoles.SIGNER]: {
    OWNER: [''],
    ADMIN: [''],
    MANAGER: [''],
    SIGNER: ['*'],
    VIEWER: [''],
  },
  [PermissionRoles.ADMIN]: {
    OWNER: [''],
    ADMIN: ['*'],
    MANAGER: [''],
    SIGNER: [''],
    VIEWER: [''],
  },
  [PermissionRoles.MANAGER]: {
    OWNER: [''],
    ADMIN: [''],
    MANAGER: ['*'],
    SIGNER: [''],
    VIEWER: [''],
  },
  [PermissionRoles.VIEWER]: {
    OWNER: [''],
    ADMIN: [''],
    MANAGER: [''],
    SIGNER: [''],
    VIEWER: ['*'],
  },
};
