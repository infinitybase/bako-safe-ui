export interface WorkspaceContact {
  id: string;
  nickname: string;
  user: { id: string; address: string; avatar: string };
}
export enum PermissionRoles {
  OWNER = "OWNER", // owner of the workspace, THIS ROLE CAN'T BE CHANGED
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SIGNER = "SIGNER",
  VIEWER = "VIEWER",
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

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  avatar: string;
  permissions: IPermission;
  single: boolean;
  owner: Member;
  members: Member[];
  predicates: number;
}
