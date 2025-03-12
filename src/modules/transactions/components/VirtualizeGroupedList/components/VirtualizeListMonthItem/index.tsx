import { Divider, HStack, Text } from '@chakra-ui/react';
import { Virtualizer } from '@tanstack/react-virtual';

interface VirtualizeListMonthItemProps {
  monthYear: string;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
}

const VirtualizeListMonthItem = ({
  monthYear,
  virtualizer,
}: VirtualizeListMonthItemProps) => {
  return (
    <HStack w="full" mb={2} ref={virtualizer.measureElement}>
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
};

export default VirtualizeListMonthItem;
