import { useState, useCallback, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, HStack, Text } from '@chakra-ui/react';

interface DateRangeFilterProps {
  dateFrom?: string;
  dateTo?: string;
  onDateRangeChange: (dateFrom?: string, dateTo?: string) => void;
}

const STORAGE_KEY = 'transaction_date_filter';

const DateRangeFilter = ({ dateFrom, dateTo, onDateRangeChange }: DateRangeFilterProps) => {
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom || '');
  const [localDateTo, setLocalDateTo] = useState(dateTo || '');
  const [errors, setErrors] = useState<{ dateFrom?: string; dateTo?: string }>({});

  // Load from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { dateFrom: storedFrom, dateTo: storedTo } = JSON.parse(stored);
        if (storedFrom || storedTo) {
          setLocalDateFrom(storedFrom || '');
          setLocalDateTo(storedTo || '');
          onDateRangeChange(storedFrom, storedTo);
        }
      } catch (error) {
        // Invalid JSON, ignore
      }
    }
  }, [onDateRangeChange]);

  // Save to sessionStorage when dates change
  const saveToStorage = useCallback((from?: string, to?: string) => {
    if (from || to) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ dateFrom: from, dateTo: to }));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const validateDates = useCallback((from: string, to: string) => {
    const newErrors: { dateFrom?: string; dateTo?: string } = {};
    const today = new Date().toISOString().split('T')[0];

    // Check if both fields are filled when one is provided
    if ((from && !to) || (!from && to)) {
      newErrors.dateFrom = 'Ambos os campos de data são obrigatórios';
      newErrors.dateTo = 'Ambos os campos de data são obrigatórios';
    }

    // Check if dates are not in the future
    if (from && from > today) {
      newErrors.dateFrom = 'Datas futuras não são permitidas';
    }
    if (to && to > today) {
      newErrors.dateTo = 'Datas futuras não são permitidas';
    }

    // Check if start date is not after end date
    if (from && to && from > to) {
      newErrors.dateFrom = 'Data inicial deve ser anterior à data final';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleDateFromChange = useCallback((value: string) => {
    const sanitizedValue = value.replace(/[^0-9-]/g, '');
    setLocalDateFrom(sanitizedValue);
    
    if (validateDates(sanitizedValue, localDateTo)) {
      const fromValue = sanitizedValue || undefined;
      const toValue = localDateTo || undefined;
      onDateRangeChange(fromValue, toValue);
      saveToStorage(fromValue, toValue);
    }
  }, [localDateTo, onDateRangeChange, validateDates, saveToStorage]);

  const handleDateToChange = useCallback((value: string) => {
    const sanitizedValue = value.replace(/[^0-9-]/g, '');
    setLocalDateTo(sanitizedValue);
    
    if (validateDates(localDateFrom, sanitizedValue)) {
      const fromValue = localDateFrom || undefined;
      const toValue = sanitizedValue || undefined;
      onDateRangeChange(fromValue, toValue);
      saveToStorage(fromValue, toValue);
    }
  }, [localDateFrom, onDateRangeChange, validateDates, saveToStorage]);

  const handleClear = useCallback(() => {
    setLocalDateFrom('');
    setLocalDateTo('');
    setErrors({});
    onDateRangeChange(undefined, undefined);
    saveToStorage(undefined, undefined);
  }, [onDateRangeChange, saveToStorage]);

  return (
    <Box>
      <HStack spacing={4} align="flex-start">
        <FormControl isInvalid={!!errors.dateFrom}>
          <FormLabel fontSize="sm">Data Inicial</FormLabel>
          <Input
            type="date"
            value={localDateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
            size="sm"
          />
          {errors.dateFrom && (
            <Text color="red.500" fontSize="xs" mt={1}>
              {errors.dateFrom}
            </Text>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.dateTo}>
          <FormLabel fontSize="sm">Data Final</FormLabel>
          <Input
            type="date"
            value={localDateTo}
            onChange={(e) => handleDateToChange(e.target.value)}
            size="sm"
          />
          {errors.dateTo && (
            <Text color="red.500" fontSize="xs" mt={1}>
              {errors.dateTo}
            </Text>
          )}
        </FormControl>

        <Button
          size="sm"
          variant="outline"
          onClick={handleClear}
          isDisabled={!localDateFrom && !localDateTo}
          mt={6}
        >
          Limpar Filtros
        </Button>
      </HStack>
    </Box>
  );
};

export { DateRangeFilter };