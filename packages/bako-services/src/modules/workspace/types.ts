import type { IPagination } from "@/types";
import type { Predicate } from "../vault";
import type { ITransaction } from "../transaction";
import type { IWitnesses, TransactionStatus } from "bakosafe";
import type { BN } from "fuels";

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

type RolePermissions = Record<PermissionRoles, string[]>;

export const defaultPermissions: Record<PermissionRoles, RolePermissions> = {
  [PermissionRoles.OWNER]: {
    OWNER: ["*"],
    ADMIN: [""],
    MANAGER: [""],
    SIGNER: [""],
    VIEWER: [""],
  },
  [PermissionRoles.SIGNER]: {
    OWNER: [""],
    ADMIN: [""],
    MANAGER: [""],
    SIGNER: ["*"],
    VIEWER: [""],
  },
  [PermissionRoles.ADMIN]: {
    OWNER: [""],
    ADMIN: ["*"],
    MANAGER: [""],
    SIGNER: [""],
    VIEWER: [""],
  },
  [PermissionRoles.MANAGER]: {
    OWNER: [""],
    ADMIN: [""],
    MANAGER: ["*"],
    SIGNER: [""],
    VIEWER: [""],
  },
  [PermissionRoles.VIEWER]: {
    OWNER: [""],
    ADMIN: [""],
    MANAGER: [""],
    SIGNER: [""],
    VIEWER: ["*"],
  },
};

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

export interface ITransactionResume {
  id: string;
  hash: string;
  totalSigners: number;
  requiredSigners: number;
  predicate: {
    id: string;
    address: string;
  };
  status: TransactionStatus;
  witnesses: IWitnesses[];
  gasUsed?: string;
  sendTime?: Date;
  error?: string;
}

export interface CreateWorkspacePayload {
  name: string;
  members?: string[];
  description?: string;
  avatar?: string;
  single?: boolean;
  permissions?: IPermissions;
}

export interface WorkspaceHomeResponse {
  predicates: IPagination<Predicate>;
  transactions: IPagination<ITransaction & { predicate: Predicate }>;
}

export interface IncludeWorkspaceMemberPayload {
  address: string;
}

export interface UpdateWorkspacePermissionsPayload {
  member: string;
  permissions: IPermission;
}
export interface DeleteWorkspaceMemberPayload {
  member: string;
}

export interface SelectWorkspacePayload {
  workspace: string;
  user: string;
}

export type ListUserWorkspacesResponse = Workspace[];
export type CreateWorkspaceResponse = Workspace;
export type UpdateWorkspaceMembersResponse = Workspace;
export type IncludeWorkspaceMemberResponse = Workspace;
export type UpdateWorkspacePermissionsResponse = Workspace;
export type GetWorkspaceByIdResponse = Workspace;
export type SelectWorkspaceResponse = {
  workspace: Workspace;
};

export type IWorkspaceBalance = {
  currentBalanceUSD: string;
  currentBalance: {
    assetId: string;
    amount: BN;
  }[];
};

export type GetWorkspaceBalanceResponse = IWorkspaceBalance;
