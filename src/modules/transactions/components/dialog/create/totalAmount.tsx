import { Flex, HStack, Text } from 'bako-ui';
import { memo } from 'react';

export const TotalAmount = memo(
  ({ totalAmount }: { totalAmount: string | undefined }) => {
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
  },
);

TotalAmount.displayName = 'TotalAmount';
