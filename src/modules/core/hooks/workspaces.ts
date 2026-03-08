import { TransactionType } from 'bakosafe';

import { StatusFilter } from '@/modules/transactions/hooks/list/useTransactionList';

export const WorkspacesQueryKey = {
  TRANSACTION_LIST_PAGINATION_QUERY_KEY: (
    workspaceId: string,
    status?: StatusFilter,
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