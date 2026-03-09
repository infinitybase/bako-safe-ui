export interface GetTransactionParams {
  workspaceId?: string;
  predicateId?: string[];
  id?: string;
  status?: string[];
  type?: string;
  orderBy?: string;
  sort?: string;
}

export enum TransactionOrderBy {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}