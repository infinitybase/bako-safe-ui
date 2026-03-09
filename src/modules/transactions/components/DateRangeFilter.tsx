import { useState } from 'react';
import { Box, Button, Input, Text, VStack, HStack } from '@chakra-ui/react';

interface DateRangeFilterProps {
  onApplyFilter: (dateFrom?: string, dateTo?: string) => boolean;
  onClearFilter: () => void;
  error?: string;
  dateFilter: {
    dateFrom?: string;
    dateTo?: string;
  };
}

export const DateRangeFilter = ({
  onApplyFilter,
  onClearFilter,
  error,
  dateFilter,
}: DateRangeFilterProps) => {
  const [dateFrom, setDateFrom] = useState(dateFilter.dateFrom || '');
  const [dateTo, setDateTo] = useState(dateFilter.dateTo || '');

  const handleApply = () => {
    onApplyFilter(dateFrom || undefined, dateTo || undefined);
  };

  const handleClear = () => {
    setDateFrom('');
    setDateTo('');
    onClearFilter();
  };

  const hasActiveFilter = dateFilter.dateFrom || dateFilter.dateTo;

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="semibold">Filtrar por período</Text>
        
        <HStack spacing={4}>
          <Box flex={1}>
            <Text fontSize="sm" mb={2}>Data inicial</Text>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              bg="white"
            />
          </Box>
          
          <Box flex={1}>
            <Text fontSize="sm" mb={2}>Data final</Text>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              bg="white"
            />
          </Box>
        </HStack>

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}

        <HStack spacing={3}>
          <Button
            colorScheme="blue"
            onClick={handleApply}
            size="sm"
          >
            Aplicar filtro
          </Button>
          
          {hasActiveFilter && (
            <Button
              variant="outline"
              onClick={handleClear}
              size="sm"
            >
              Limpar filtro
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};