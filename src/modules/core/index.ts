export * from './hooks';

export const WorkspacesQueryKey = {
  TRANSACTION_LIST_PAGINATION_QUERY_KEY: (
    workspaceId: string,
    status?: string,
    predicateId?: string,
    id?: string,
    type?: string,
    dateFrom?: string,
    dateTo?: string,
  ) => [
    'workspaces',
    workspaceId,
    'transactions',
    'pagination',
    { status, predicateId, id, type, dateFrom, dateTo },
  ],
};