import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransactionList } from '../../hooks/list/useTransactionList';
import { toast } from 'react-toastify';
import React from 'react';

// Mock dependencies
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}));

jest.mock('@/modules/core/services/api', () => ({
  api: {
    get: jest.fn()
  }
}));

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

describe('useTransactionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('AC1: Date filtering integration', () => {
    it('should apply date filters correctly', async () => {
      const { result } = renderHook(() => useTransactionList(), {
        wrapper: createWrapper()
      });
      
      act(() => {
        result.current.setDateStart('2024-01-01');
        result.current.setDateEnd('2024-06-30');
      });
      
      expect(result.current.dateStart).toBe('2024-01-01');
      expect(result.current.dateEnd).toBe('2024-06-30');
      expect(result.current.hasDateFilters).toBe(true);
      
      const success = result.current.applyFilters();
      expect(success).toBe(true);
      expect(toast.error).not.toHaveBeenCalled();
    });
    
    it('should handle only start date filter', async () => {
      const { result } = renderHook(() => useTransactionList(), {
        wrapper: createWrapper()
      });
      
      act(() => {
        result.current.setDateStart('2024-01-01');
      });
      
      expect(result.current.hasDateFilters).toBe(true);
      
      const success = result.current.applyFilters();
      expect(success).toBe(true);
    });
    
    it('should handle only end date filter', async () => {
      const { result } = renderHook(() => useTransactionList(), {
        wrapper: createWrapper()
      });
      
      act(() => {
        result.current.setDateEnd('2024-12-31');
      });
      
      expect(result.current.hasDateFilters).toBe(true);
      
      const success = result.current.applyFilters();
      expect(success).toBe(true);
    });
  });
  
  describe('AC6: 1 year validation', () => {
    it('should show error and prevent filter application for range > 1 year', async () => {
      const { result } = renderHook(() => useTransactionList(), {
        wrapper: createWrapper()
      });
      
      act(() => {
        result.current.setDateStart('2023-01-01');
        result.current.setDateEnd('2024-06-01'); // More than 1 year
      });
      
      const success = result.current.applyFilters();
      
      expect(success).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Intervalo máximo permitido é de 1 ano');
    });
    
    it('should show error for end date before start date', async () => {
      const { result } = renderHook(() => useTransactionList(), {
        wrapper: createWrapper()
      });
      
      act(() => {
        result.current.setDateStart('2024-06-01');
        result.current.setDateEnd('2024-01-01');
      });
      
      const success = result.current.applyFilters();
      
      expect(success).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Data fim deve ser posterior à data início');
    });
  });
  
  it('should clear all filters including dates', () => {
    const { result } = renderHook(() => useTransactionList(), {
      wrapper: createWrapper()
    });
    
    act(() => {
      result.current.setDateStart('2024-01-01');
      result.current.setDateEnd('2024-12-31');
    });
    
    expect(result.current.hasDateFilters).toBe(true);
    
    act(() => {
      result.current.clearAllFilters();
    });
    
    expect(result.current.dateStart).toBeUndefined();
    expect(result.current.dateEnd).toBeUndefined();
    expect(result.current.hasDateFilters).toBe(false);
  });
});