import { Flex, HStack, Text } from 'bako-ui';
import { memo } from 'react';

interface TotalAmountProps {
  totalAmount?: string;
}

export const TotalAmount = memo(({ totalAmount }: TotalAmountProps) => {
  return (
    <Flex
      wrap="wrap"
      justifyContent="space-between"
      alignItems="center"
      w="full"
    >
      <HStack align="center" gap={1}>
        <Text visibility={!totalAmount ? 'hidden' : 'visible'} fontSize="xs">
          Total Amount
        </Text>
      </HStack>
      <HStack align="center" gap={1}>
        <Text fontSize="xs">{totalAmount && `~${totalAmount}`}</Text>
      </HStack>
    </Flex>
  );
});

TotalAmount.displayName = 'TotalAmount';
