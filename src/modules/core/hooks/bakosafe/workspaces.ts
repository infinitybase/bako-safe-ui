import { TransactionType } from 'bakosafe';

export const WorkspacesQueryKey = {
  TRANSACTION_LIST_PAGINATION_QUERY_KEY: (
    workspaceId: string,
    status?: string,
    predicateId?: string,
    id?: string,
    type?: TransactionType,
    dateFrom?: Date,
    dateTo?: Date,
  ) => [
    'workspaces',
    workspaceId,
    'transactions',
    'pagination',
    status,
    predicateId,
    id,
    type,
    dateFrom,
    dateTo,
  ],
};