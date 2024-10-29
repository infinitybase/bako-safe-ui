import { TransactionType } from 'bakosafe';

import { AddressBookQueryKey } from '../addressBook/utils';
import { HomeQueryKey } from '../home/utils';

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
  ADD_MEMBER: () => [WorkspacesQueryKey.DEFAULT, 'add-member'],
  UPDATE_PERMISSION: () => [WorkspacesQueryKey.DEFAULT, 'update-permission'],
  DELETE_MEMBER: () => [WorkspacesQueryKey.DEFAULT, 'delete-member'],
  TRANSACTION_LIST_PAGINATION_QUERY_KEY: (
    workspaceId: string,
    status?: string,
    vaultId?: string,
    id?: string,
    type?: TransactionType,
  ) => [
    WorkspacesQueryKey.DEFAULT,
    'transaction-list-pagination',
    workspaceId,
    vaultId,
    status,
    id,
    type,
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
  FULL_DATA: (workspaceId: string, status?: string) => [
    WorkspacesQueryKey.DEFAULT,
    WorkspacesQueryKey.HOME(),
    HomeQueryKey.FULL_DATA(workspaceId),
    WorkspacesQueryKey.GET_BALANCE(workspaceId),
    WorkspacesQueryKey.PENDING_TRANSACTIONS(workspaceId),
    WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
      workspaceId,
      status,
    ),
    AddressBookQueryKey.LIST_BY_USER(workspaceId),
  ],
};
