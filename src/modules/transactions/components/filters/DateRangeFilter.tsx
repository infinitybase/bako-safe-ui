import { useState, useCallback, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, HStack, Text } from '@chakra-ui/react';

interface DateRangeFilterProps {
  dateFrom?: string;
  dateTo?: string;
  onDateRangeChange: (dateFrom?: string, dateTo?: string) => void;
}

const DateRangeFilter = ({ dateFrom, dateTo, onDateRangeChange }: DateRangeFilterProps) => {
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom || '');
  const [localDateTo, setLocalDateTo] = useState(dateTo || '');
  const [errors, setErrors] = useState<{ dateFrom?: string; dateTo?: string; general?: string }>({});

  // Sync with external props
  useEffect(() => {
    setLocalDateFrom(dateFrom || '');
    setLocalDateTo(dateTo || '');
  }, [dateFrom, dateTo]);

  const sanitizeInput = useCallback((value: string) => {
    // Remove any potential XSS characters and ensure it's a valid date format
    return value.replace(/[^0-9-]/g, '').slice(0, 10);
  }, []);

  const validateDates = useCallback((from: string, to: string) => {
    const newErrors: { dateFrom?: string; dateTo?: string; general?: string } = {};
    const today = new Date().toISOString().split('T')[0];

    // Clear previous errors
    setErrors({});

    // Check if both fields are filled when one is provided
    if ((from && !to) || (!from && to)) {
      newErrors.general = 'Ambos os campos de data são obrigatórios';
      setErrors(newErrors);
      return false;
    }

    // If both are empty, it's valid (no filter)
    if (!from && !to) {
      return true;
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
    const sanitizedValue = sanitizeInput(value);
    setLocalDateFrom(sanitizedValue);
    
    if (validateDates(sanitizedValue, localDateTo)) {
      onDateRangeChange(sanitizedValue || undefined, localDateTo || undefined);
    }
  }, [localDateTo, onDateRangeChange, validateDates, sanitizeInput]);

  const handleDateToChange = useCallback((value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setLocalDateTo(sanitizedValue);
    
    if (validateDates(localDateFrom, sanitizedValue)) {
      onDateRangeChange(localDateFrom || undefined, sanitizedValue || undefined);
    }
  }, [localDateFrom, onDateRangeChange, validateDates, sanitizeInput]);

  const handleClear = useCallback(() => {
    setLocalDateFrom('');
    setLocalDateTo('');
    setErrors({});
    onDateRangeChange(undefined, undefined);
  }, [onDateRangeChange]);

  return (
    <Box>
      <HStack spacing={4} align="start">
        <FormControl isInvalid={!!errors.dateFrom}>
          <FormLabel fontSize="sm">Data inicial</FormLabel>
          <Input
            type="date"
            value={localDateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
            size="sm"
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dateFrom && (
            <Text color="red.500" fontSize="xs" mt={1}>
              {errors.dateFrom}
            </Text>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.dateTo}>
          <FormLabel fontSize="sm">Data final</FormLabel>
          <Input
            type="date"
            value={localDateTo}
            onChange={(e) => handleDateToChange(e.target.value)}
            size="sm"
            max={new Date().toISOString().split('T')[0]}
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
      
      {errors.general && (
        <Text color="red.500" fontSize="xs" mt={2}>
          {errors.general}
        </Text>
      )}
    </Box>
  );
};

export { DateRangeFilter };