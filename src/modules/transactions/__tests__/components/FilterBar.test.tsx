import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { FilterBar } from '../../components/FilterBar';

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      {component}
    </ChakraProvider>
  );
};

describe('FilterBar', () => {
  const defaultProps = {
    setDateStart: jest.fn(),
    setDateEnd: jest.fn(),
    onApplyFilters: jest.fn(),
    onClearFilters: jest.fn(),
    hasActiveFilters: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AC3: End date before start date validation', () => {
    it('should show error when end date is before start date', () => {
      renderWithChakra(
        <FilterBar
          {...defaultProps}
          dateStart="2024-06-01"
          dateEnd="2024-01-01"
        />
      );

      expect(screen.getByText('Data fim deve ser posterior à data início')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /aplicar filtros/i })).toBeDisabled();
    });

    it('should not apply filters when validation error exists', () => {
      renderWithChakra(
        <FilterBar
          {...defaultProps}
          dateStart="2024-06-01"
          dateEnd="2024-01-01"
        />
      );

      const applyButton = screen.getByRole('button', { name: /aplicar filtros/i });
      expect(applyButton).toBeDisabled();
      
      fireEvent.click(applyButton);
      expect(defaultProps.onApplyFilters).not.toHaveBeenCalled();
    });
  });

  describe('AC5: Clear filters functionality', () => {
    it('should call onClearFilters when clear button is clicked', () => {
      renderWithChakra(
        <FilterBar
          {...defaultProps}
          hasActiveFilters={true}
          dateStart="2024-01-01"
          dateEnd="2024-12-31"
        />
      );

      const clearButton = screen.getByRole('button', { name: /limpar filtros/i });
      fireEvent.click(clearButton);
      
      expect(defaultProps.onClearFilters).toHaveBeenCalled();
    });

    it('should disable clear button when no active filters', () => {
      renderWithChakra(
        <FilterBar
          {...defaultProps}
          hasActiveFilters={false}
        />
      );

      const clearButton = screen.getByRole('button', { name: /limpar filtros/i });
      expect(clearButton).toBeDisabled();
    });
  });

  describe('AC6: 1 year maximum validation', () => {
    it('should show error for range exceeding 1 year', () => {
      renderWithChakra(
        <FilterBar
          {...defaultProps}
          dateStart="2023-01-01"
          dateEnd="2024-06-01"
        />
      );

      expect(screen.getByText('Intervalo máximo permitido é de 1 ano')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /aplicar filtros/i })).toBeDisabled();
    });
  });

  it('should handle date input changes', () => {
    renderWithChakra(
      <FilterBar {...defaultProps} />
    );

    const startDateInput = screen.getByDisplayValue('');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    
    expect(defaultProps.setDateStart).toHaveBeenCalledWith('2024-01-01');
  });

  it('should enable apply button when no validation errors', () => {
    renderWithChakra(
      <FilterBar
        {...defaultProps}
        dateStart="2024-01-01"
        dateEnd="2024-06-30"
      />
    );

    const applyButton = screen.getByRole('button', { name: /aplicar filtros/i });
    expect(applyButton).not.toBeDisabled();
  });
});