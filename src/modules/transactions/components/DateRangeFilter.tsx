import { Box, HStack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

import { CustomSkeleton } from '@/components';
import { Card } from '@/components/card';
import { DatePicker } from '@/components/datePicker';

export interface DateRangeFilterProps {
  dateFrom?: Date;
  dateTo?: Date;
  onDateFromChange: (date?: Date) => void;
  onDateToChange: (date?: Date) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const DateRangeFilter = ({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  isLoading,
}: DateRangeFilterProps) => {
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  if (isLoading) {
    return (
      <HStack spacing={4}>
        <CustomSkeleton w="200px" h="40px" />
        <CustomSkeleton w="200px" h="40px" />
      </HStack>
    );
  }

  return (
    <HStack spacing={4}>
      <Box>
        <Text fontSize="sm" mb={2} color="grey.500">
          From
        </Text>
        <DatePicker
          isOpen={isFromOpen}
          onClose={() => setIsFromOpen(false)}
          onOpen={() => setIsFromOpen(true)}
          value={dateFrom}
          onChange={onDateFromChange}
          maxDate={dateTo}
        >
          <Card
            as="button"
            onClick={() => setIsFromOpen(true)}
            px={3}
            py={2}
            minW="160px"
            cursor="pointer"
            _hover={{ bg: 'grey.825' }}
          >
            <HStack spacing={2}>
              <Calendar size={16} />
              <Text fontSize="sm">
                {dateFrom ? format(dateFrom, 'MMM dd, yyyy') : 'Select date'}
              </Text>
            </HStack>
          </Card>
        </DatePicker>
      </Box>

      <Box>
        <Text fontSize="sm" mb={2} color="grey.500">
          To
        </Text>
        <DatePicker
          isOpen={isToOpen}
          onClose={() => setIsToOpen(false)}
          onOpen={() => setIsToOpen(true)}
          value={dateTo}
          onChange={onDateToChange}
          minDate={dateFrom}
        >
          <Card
            as="button"
            onClick={() => setIsToOpen(true)}
            px={3}
            py={2}
            minW="160px"
            cursor="pointer"
            _hover={{ bg: 'grey.825' }}
          >
            <HStack spacing={2}>
              <Calendar size={16} />
              <Text fontSize="sm">
                {dateTo ? format(dateTo, 'MMM dd, yyyy') : 'Select date'}
              </Text>
            </HStack>
          </Card>
        </DatePicker>
      </Box>

      {(dateFrom || dateTo) && (
        <Box pt={6}>
          <Text
            as="button"
            fontSize="sm"
            color="brand.500"
            cursor="pointer"
            onClick={onClearFilters}
            _hover={{ textDecoration: 'underline' }}
          >
            Clear dates
          </Text>
        </Box>
      )}
    </HStack>
  );
};

export { DateRangeFilter };