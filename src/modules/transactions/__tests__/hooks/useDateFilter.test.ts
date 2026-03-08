import { renderHook, act } from '@testing-library/react';
import { useDateFilter } from '../../hooks/filter/useDateFilter';
import { DATE_FILTER_ERRORS } from '@/modules/core/constants/errorMessages';

describe('useDateFilter', () => {
  describe('AC1: Date range filtering', () => {
    it('should handle only start date', () => {
      const { result } = renderHook(() => useDateFilter());
      
      act(() => {
        result.current.setDateStart('2024-01-01');
      });
      
      expect(result.current.dateStart).toBe('2024-01-01');
      expect(result.current.dateEnd).toBeUndefined();
      expect(result.current.hasDateFilters).toBe(true);
      expect(result.current.validateDateRange()).toBeNull();
    });
    
    it('should handle only end date', () => {
      const { result } = renderHook(() => useDateFilter());
      
      act(() => {
        result.current.setDateEnd('2024-12-31');
      });
      
      expect(result.current.dateStart).toBeUndefined();
      expect(result.current.dateEnd).toBe('2024-12-31');
      expect(result.current.hasDateFilters).toBe(true);
      expect(result.current.validateDateRange()).toBeNull();
    });
    
    it('should handle both start and end dates', () => {
      const { result } = renderHook(() => useDateFilter());
      
      act(() => {
        result.current.setDateStart('2024-01-01');
        result.current.setDateEnd('2024-06-30');
      });
      
      expect(result.current.dateStart).toBe('2024-01-01');
      expect(result.current.dateEnd).toBe('2024-06-30');
      expect(result.current.hasDateFilters).toBe(true);
      expect(result.current.validateDateRange()).toBeNull();
    });
  });
  
  describe('AC6: 1 year maximum validation', () => {
    it('should return error for range exceeding 1 year', () => {
      const { result } = renderHook(() => useDateFilter());
      
      act(() => {
        result.current.setDateStart('2023-01-01');
        result.current.setDateEnd('2024-06-01'); // More than 1 year
      });
      
      expect(result.current.validateDateRange()).toBe(DATE_FILTER_ERRORS.MAX_RANGE_EXCEEDED);
    });
    
    it('should allow range of exactly 1 year', () => {
      const { result } = renderHook(() => useDateFilter());
      
      act(() => {
        result.current.setDateStart('2023-01-01');
        result.current.setDateEnd('2023-12-31'); // Exactly 1 year
      });
      
      expect(result.current.validateDateRange()).toBeNull();
    });
    
    it('should return error when end date is before start date', () => {
      const { result } = renderHook(() => useDateFilter());
      
      act(() => {
        result.current.setDateStart('2024-06-01');
        result.current.setDateEnd('2024-01-01');
      });
      
      expect(result.current.validateDateRange()).toBe(DATE_FILTER_ERRORS.END_DATE_BEFORE_START);
    });
  });
  
  it('should clear dates', () => {
    const { result } = renderHook(() => useDateFilter({
      dateStart: '2024-01-01',
      dateEnd: '2024-12-31'
    }));
    
    expect(result.current.hasDateFilters).toBe(true);
    
    act(() => {
      result.current.clearDates();
    });
    
    expect(result.current.dateStart).toBeUndefined();
    expect(result.current.dateEnd).toBeUndefined();
    expect(result.current.hasDateFilters).toBe(false);
  });
});