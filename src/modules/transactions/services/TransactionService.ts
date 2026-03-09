import { api } from '@/config/api';
import { GetTransactionParams } from './types';

export class TransactionService {
  static async getTransactionsPagination(params: GetTransactionParams & { 
    perPage: number; 
    page: number; 
    dateFrom?: string; 
    dateTo?: string; 
  }) {
    const queryParams = new URLSearchParams();
    
    // Add existing parameters
    if (params.workspaceId) queryParams.append('workspaceId', params.workspaceId);
    if (params.predicateId?.length) {
      params.predicateId.forEach(id => queryParams.append('predicateId', id));
    }
    if (params.id) queryParams.append('id', params.id);
    if (params.status?.length) {
      params.status.forEach(status => queryParams.append('status', status));
    }
    if (params.type) queryParams.append('type', params.type);
    if (params.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params.sort) queryParams.append('sort', params.sort);
    
    queryParams.append('perPage', params.perPage.toString());
    queryParams.append('page', params.page.toString());
    
    // Add date filters with sanitization
    if (params.dateFrom) {
      // Sanitize date input to prevent injection
      const sanitizedDateFrom = params.dateFrom.replace(/[^0-9-]/g, '').slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(sanitizedDateFrom)) {
        queryParams.append('dateFrom', sanitizedDateFrom);
      }
    }
    if (params.dateTo) {
      // Sanitize date input to prevent injection
      const sanitizedDateTo = params.dateTo.replace(/[^0-9-]/g, '').slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(sanitizedDateTo)) {
        queryParams.append('dateTo', sanitizedDateTo);
      }
    }
    
    const response = await api.get(`/transactions?${queryParams.toString()}`);
    return response.data;
  }
}