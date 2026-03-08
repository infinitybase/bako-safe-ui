export interface GetTransactionParams {
  page?: number;
  perPage?: number;
  predicateId?: string[];
  status?: string[];
  type?: string;
  orderBy?: string;
  sort?: string;
  id?: string;
}

export enum TransactionOrderBy {
  CREATED_AT = 'createdAt',
}

export interface TransactionWithVault {
  id: string;
  hash: string;
  status: string;
  name: string;
}

export class TransactionService {
  static async getTransactionsPagination(params: GetTransactionParams & {
    dateFrom?: string;
    dateTo?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    const response = await fetch(`/api/transactions?${queryParams}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch transactions');
    }
    
    return response.json();
  }

  static async getByHash(hash: string, status?: string[]) {
    const queryParams = new URLSearchParams();
    
    if (status) {
      status.forEach(s => queryParams.append('status', s));
    }

    const response = await fetch(`/api/transactions/${hash}?${queryParams}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch transaction');
    }
    
    return response.json();
  }
}