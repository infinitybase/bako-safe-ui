import React from 'react';
import { Box, Button, Input, Text, VStack, HStack } from '@chakra-ui/react';
import { UseDateFilterReturn } from '../hooks/filter/useDateFilter';

export interface FilterBarProps {
  dateStart?: string;
  dateEnd?: string;
  setDateStart: (date?: string) => void;
  setDateEnd: (date?: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  isLoading?: boolean;
  validationError?: string | null;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  dateStart,
  dateEnd,
  setDateStart,
  setDateEnd,
  onApplyFilters,
  onClearFilters,
  hasActiveFilters,
  isLoading = false,
  validationError
}) => {
  const handleDateStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateStart(value || undefined);
  };

  const handleDateEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateEnd(value || undefined);
  };

  const handleApplyClick = () => {
    onApplyFilters();
  };

  const handleClearClick = () => {
    onClearFilters();
  };

  // Real-time validation display
  const getValidationError = () => {
    if (!dateStart && !dateEnd) return null;
    
    if (dateStart && dateEnd) {
      const startDate = new Date(dateStart);
      const endDate = new Date(dateEnd);
      
      if (endDate <= startDate) {
        return 'Data fim deve ser posterior à data início';
      }
      
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 365) {
        return 'Intervalo máximo permitido é de 1 ano';
      }
    }
    
    return null;
  };

  const currentValidationError = validationError || getValidationError();
  const hasError = !!currentValidationError;

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="semibold">
          Filtros de Data
        </Text>
        
        <HStack spacing={4}>
          <VStack align="stretch" flex={1}>
            <Text fontSize="sm" fontWeight="medium">
              Data Início
            </Text>
            <Input
              type="date"
              value={dateStart || ''}
              onChange={handleDateStartChange}
              placeholder="Selecione a data início"
              isInvalid={hasError}
            />
          </VStack>
          
          <VStack align="stretch" flex={1}>
            <Text fontSize="sm" fontWeight="medium">
              Data Fim
            </Text>
            <Input
              type="date"
              value={dateEnd || ''}
              onChange={handleDateEndChange}
              placeholder="Selecione a data fim"
              isInvalid={hasError}
            />
          </VStack>
        </HStack>
        
        {currentValidationError && (
          <Text color="red.500" fontSize="sm">
            {currentValidationError}
          </Text>
        )}
        
        <HStack spacing={3}>
          <Button
            colorScheme="blue"
            onClick={handleApplyClick}
            isLoading={isLoading}
            loadingText="Aplicando..."
            isDisabled={hasError}
          >
            Aplicar Filtros
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClearClick}
            isDisabled={!hasActiveFilters || isLoading}
          >
            Limpar Filtros
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};