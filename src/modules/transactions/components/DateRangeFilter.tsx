import { useState } from 'react';
import { Button, Input, Text, VStack, HStack, Alert, AlertIcon } from '@chakra-ui/react';

interface DateRangeFilterProps {
  onApplyFilter: (dateFrom?: string, dateTo?: string) => void;
  onClearFilter: () => void;
  error?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const DateRangeFilter = ({
  onApplyFilter,
  onClearFilter,
  error,
  dateFrom: initialDateFrom,
  dateTo: initialDateTo,
}: DateRangeFilterProps) => {
  const [dateFrom, setDateFrom] = useState(initialDateFrom || '');
  const [dateTo, setDateTo] = useState(initialDateTo || '');

  const handleApply = () => {
    onApplyFilter(dateFrom || undefined, dateTo || undefined);
  };

  const handleClear = () => {
    setDateFrom('');
    setDateTo('');
    onClearFilter();
  };

  const hasFilter = initialDateFrom || initialDateTo;

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <VStack align="start">
          <Text fontSize="sm" fontWeight="medium">
            Data inicial
          </Text>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            size="sm"
          />
        </VStack>
        <VStack align="start">
          <Text fontSize="sm" fontWeight="medium">
            Data final
          </Text>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            size="sm"
          />
        </VStack>
        <VStack align="end" justify="end">
          <HStack spacing={2}>
            <Button size="sm" onClick={handleApply} colorScheme="blue">
              Aplicar
            </Button>
            {hasFilter && (
              <Button size="sm" variant="outline" onClick={handleClear}>
                Limpar
              </Button>
            )}
          </HStack>
        </VStack>
      </HStack>
      {error && (
        <Alert status="error" size="sm">
          <AlertIcon />
          {error}
        </Alert>
      )}
    </VStack>
  );
};