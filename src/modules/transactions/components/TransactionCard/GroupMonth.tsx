import { Divider, HStack, StackProps, Text } from '@chakra-ui/react';
import { memo } from 'react';

interface GroupMonthProps extends StackProps {
  monthYear: string;
}

export const GroupMonth = memo(
  ({ monthYear, ...stackProps }: GroupMonthProps) => {
    return (
      <HStack w="full" {...stackProps}>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="grey.425"
          whiteSpace="nowrap"
        >
          {monthYear}
        </Text>

        <Divider w="full" borderColor="grey.950" />
      </HStack>
    );
  },
);

GroupMonth.displayName = 'GroupMonth';
