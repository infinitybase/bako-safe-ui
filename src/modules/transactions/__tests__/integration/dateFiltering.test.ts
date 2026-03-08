import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransactionList } from '../../hooks/list/useTransactionList';
import { api } from '@/modules/core/services/api';
import React from 'react';

// Mock API
jest.mock('@/modules/core/services/api', () => ({
  api: {
    get: jest.fn()
  }
}));

const mockApi = api as jest.Mocked<typeof api>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
};

describe('Date Filtering Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AC1: Date range filtering with optional fields', () => {
    it('should filter transactions from start date when only dateStart provided', async () => {
      mockApi.get.mockResolvedValue({
        data: {
          transactions: [
            { id: '1', createdAt: '2024-02-01', status: 'Completed' },
            { id: '2', createdAt: '2024-03-01', status: 'Pending' }
          ],
          totalCount: 2
        }
      });

      const { result } = renderHook(() => useTransactionList(), {
        wrapper: createWrapper()
      });

      act(() => {
        result.current.setDateStart('2024-01-01');
      });

      act(() => {
        result.current.applyFilters();
      });

      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringContaining('dateStart=2024-01-01')
      );
      expect(mockApi.get).toHaveBeenCalledWith(
        expect.not.stringContaining('dateEnd=')
      );
    });

    it('should filter transactions up to end date when only dateEnd provided', async () => {
      mockApi.get.mockResolvedValue({
        data: {
          transactions: [
            { id: '1', createdAt: '2024-01-01', status: 'Completed' }
          ],
          totalCount: 1
        }
      });

      const { result } = renderHook(() => useTransactionList(), {
        wrapper: createWrapper()
      });

      act(() => {
        result.current.setDateEnd('2024-06-30');
      });

      act(() => {
        result.current.applyFilters();
      });

      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringContaining('dateEnd=2024-06-30')
      );
      expect(mockApi.get).toHaveBeenCalledWith(
        expect.not.stringContaining('dateStart=')
      );
    });

    it('should filter transactions within date range when both dates provided', async () => {
      mockApi.get.mockResolvedValue({
        data: {
          transactions: [
            { id: '1', createdAt: '2024-03-15', status: 'Completed' }
          ],
          totalCount: 1
        }
      });

      const { result } = renderHook(() => useTransactionList(), {
        wrapper: createWrapper()
      });

      act(() => {
        result.current.setDateStart('2024-01-01');
        result.current.setDateEnd('2024-06-30');
      });

      act(() => {
        result.current.applyFilters();
      });

      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringContaining('dateStart=2024-01-01')
      );
      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringContaining('dateEnd=2024-06-30')
      );
    });
  });

  describe('AC2: Combined filters', () => {
    it('should combine date filters with status filter', async () => {
      mockApi.get.mockResolvedValue({
        data: {
          transactions: [
            { id: '1', createdAt: '2024-03-15', status: 'Completed' }
          ],
          totalCount: 1
        }
      });

      const { result } = renderHook(() => 
        useTransactionList({ status: 'Completed' }), {
        wrapper: createWrapper()
      });

      act(() => {
        result.current.setDateStart('2024-01-01');
        result.current.setDateEnd('2024-06-30');
      });

      act(() => {
        result.current.applyFilters();
      });

      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringMatching(/.*status=Completed.*dateStart=2024-01-01.*dateEnd=2024-06-30.*/)
      );
    });
  });

  describe('AC4: Empty results with date filters', () => {
    it('should show specific message when no transactions found in date range', async () => {
      mockApi.get.mockResolvedValue({
        data: {
          transactions: [],
          totalCount: 0
        }
      });

      const { result } = renderHook(() => useTransactionList(), {
        wrapper: createWrapper()
      });

      act(() => {
        result.current.setDateStart('2024-01-01');
        result.current.setDateEnd('2024-01-31');
      });

      act(() => {
        result.current.applyFilters();
      });

      expect(result.current.hasEmptyDateResults).toBe(true);
      expect(result.current.emptyMessage).toBe('Nenhuma transação encontrada no período selecionado');
    });
  });
});