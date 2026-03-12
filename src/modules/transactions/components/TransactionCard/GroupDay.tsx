import { HStack, StackProps, Text } from 'bako-ui';
import { memo } from 'react';

interface GroupDayProps extends StackProps {
  day: string;
}

export const GroupDay = memo(({ day, ...stackProps }: GroupDayProps) => {
  return (
    <HStack w="full" {...stackProps}>
      <Text
        fontSize="xs"
        fontWeight="light"
        color="gray.400"
        whiteSpace="nowrap"
      >
        {day}
      </Text>
    </HStack>
  );
});

GroupDay.displayName = 'GroupDay';
