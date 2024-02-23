import { AddressBookQueryKey } from './addressBook';
import { HomeQueryKey } from './home';

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

export const WorkspacesQueryKey = {
  DEFAULT: 'workspace',
  LIST_BY_USER: () => [WorkspacesQueryKey.DEFAULT, 'list-by-user'],
  HOME: () => [WorkspacesQueryKey.DEFAULT, 'home'],
  SELECT: () => [WorkspacesQueryKey.DEFAULT, 'select'],
  GET: (workspaceId: string) => [
    WorkspacesQueryKey.DEFAULT,
    workspaceId,
    'by-id',
  ],
  ADD_MEMBER: (workspaceId: string) => [
    WorkspacesQueryKey.DEFAULT,
    workspaceId,
    'add-member',
  ],
  UPDATE_PERMISSION: (workspaceId: string) => [
    WorkspacesQueryKey.DEFAULT,
    workspaceId,
    'update-permission',
  ],
  DELETE_MEMBER: (workspaceId: string) => [
    WorkspacesQueryKey.DEFAULT,
    workspaceId,
    'delete-member',
  ],
  TRANSACTION_LIST_PAGINATION_QUERY_KEY: (workspaceId: string) => [
    WorkspacesQueryKey.DEFAULT,
    'transaction-list-pagination',
    workspaceId,
  ],
  PENDING_TRANSACTIONS: (workspaceId: string, vaultId?: string) => [
    WorkspacesQueryKey.DEFAULT,
    workspaceId,
    'pending-transactions',
    vaultId,
  ],
  GET_BALANCE: (workspaceId: string) => [
    WorkspacesQueryKey.DEFAULT,
    workspaceId,
    'balance',
  ],
  FULL_DATA: (workspaceId: string, vaultId?: string) => [
    WorkspacesQueryKey.DEFAULT,
    WorkspacesQueryKey.HOME(),
    HomeQueryKey.FULL_DATA(workspaceId),
    WorkspacesQueryKey.GET_BALANCE(workspaceId),
    WorkspacesQueryKey.PENDING_TRANSACTIONS(workspaceId, vaultId),
    WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(workspaceId),
    AddressBookQueryKey.LIST_BY_USER(workspaceId, vaultId),
  ],
};
