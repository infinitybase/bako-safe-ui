import { Box, HStack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Card } from '@/components';

interface DateRangeFilterProps {
  dateFrom?: Date;
  dateTo?: Date;
  onDateFromChange: (date?: Date) => void;
  onDateToChange: (date?: Date) => void;
  onClearFilters: () => void;
}

const DateRangeFilter = ({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: DateRangeFilterProps) => {
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const hasDateFilters = dateFrom || dateTo;

  return (
    <Card p={4}>
      <HStack spacing={4} align="center">
        <Text fontSize="sm" fontWeight="medium" color="grey.200">
          Date Range:
        </Text>
        
        <Box position="relative">
          <HStack
            spacing={2}
            cursor="pointer"
            onClick={() => setShowFromPicker(!showFromPicker)}
            p={2}
            borderRadius="md"
            border="1px solid"
            borderColor="grey.600"
            bg={dateFrom ? 'grey.800' : 'transparent'}
            _hover={{ borderColor: 'grey.500' }}
          >
            <Calendar size={16} />
            <Text fontSize="sm" color={dateFrom ? 'white' : 'grey.400'}>
              {dateFrom ? format(dateFrom, 'MMM dd, yyyy') : 'From'}
            </Text>
          </HStack>
          
          {showFromPicker && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              zIndex={1000}
              mt={1}
            >
              <DatePicker
                selected={dateFrom}
                onChange={(date) => {
                  onDateFromChange(date || undefined);
                  setShowFromPicker(false);
                }}
                maxDate={dateTo || new Date()}
                inline
                calendarClassName="custom-datepicker"
              />
            </Box>
          )}
        </Box>

        <Text color="grey.400">to</Text>

        <Box position="relative">
          <HStack
            spacing={2}
            cursor="pointer"
            onClick={() => setShowToPicker(!showToPicker)}
            p={2}
            borderRadius="md"
            border="1px solid"
            borderColor="grey.600"
            bg={dateTo ? 'grey.800' : 'transparent'}
            _hover={{ borderColor: 'grey.500' }}
          >
            <Calendar size={16} />
            <Text fontSize="sm" color={dateTo ? 'white' : 'grey.400'}>
              {dateTo ? format(dateTo, 'MMM dd, yyyy') : 'To'}
            </Text>
          </HStack>
          
          {showToPicker && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              zIndex={1000}
              mt={1}
            >
              <DatePicker
                selected={dateTo}
                onChange={(date) => {
                  onDateToChange(date || undefined);
                  setShowToPicker(false);
                }}
                minDate={dateFrom}
                maxDate={new Date()}
                inline
                calendarClassName="custom-datepicker"
              />
            </Box>
          )}
        </Box>

        {hasDateFilters && (
          <HStack
            spacing={1}
            cursor="pointer"
            onClick={onClearFilters}
            p={1}
            borderRadius="md"
            _hover={{ bg: 'grey.800' }}
          >
            <X size={14} color="#9CA3AF" />
            <Text fontSize="xs" color="grey.400">
              Clear
            </Text>
          </HStack>
        )}
      </HStack>
    </Card>
  );
};

export { DateRangeFilter };