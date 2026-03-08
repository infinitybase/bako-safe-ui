import { useState, useCallback } from 'react';
import { DATE_FILTER_ERRORS } from '@/modules/core/constants/errorMessages';

export interface DateFilterState {
  dateStart?: string;
  dateEnd?: string;
}

export interface UseDateFilterReturn {
  dateStart?: string;
  dateEnd?: string;
  setDateStart: (date?: string) => void;
  setDateEnd: (date?: string) => void;
  validateDateRange: () => string | null;
  clearDates: () => void;
  hasDateFilters: boolean;
}

const MAX_DAYS_RANGE = 365;

export const useDateFilter = (initialState?: DateFilterState): UseDateFilterReturn => {
  const [dateStart, setDateStartState] = useState<string | undefined>(initialState?.dateStart);
  const [dateEnd, setDateEndState] = useState<string | undefined>(initialState?.dateEnd);

  const validateDateRange = useCallback((): string | null => {
    if (!dateStart && !dateEnd) {
      return null;
    }

    if (dateStart && dateEnd) {
      const startDate = new Date(dateStart);
      const endDate = new Date(dateEnd);

      if (endDate <= startDate) {
        return DATE_FILTER_ERRORS.END_DATE_BEFORE_START;
      }

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > MAX_DAYS_RANGE) {
        return DATE_FILTER_ERRORS.MAX_RANGE_EXCEEDED;
      }
    }

    return null;
  }, [dateStart, dateEnd]);

  const setDateStart = useCallback((date?: string) => {
    setDateStartState(date);
  }, []);

  const setDateEnd = useCallback((date?: string) => {
    setDateEndState(date);
  }, []);

  const clearDates = useCallback(() => {
    setDateStartState(undefined);
    setDateEndState(undefined);
  }, []);

  const hasDateFilters = Boolean(dateStart || dateEnd);

  return {
    dateStart,
    dateEnd,
    setDateStart,
    setDateEnd,
    validateDateRange,
    clearDates,
    hasDateFilters
  };
};