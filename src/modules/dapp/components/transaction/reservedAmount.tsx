import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';

import { TooltipIcon } from '@/components/icons/tooltip';

export interface FeeProps {
  reservedAmount?: string;
  isLoading?: boolean;
}

const DappTransactionReservedAmount = ({
  reservedAmount,
  isLoading,
}: FeeProps) =>
  isLoading || !reservedAmount ? null : (
    <HStack display="flex" justifyContent="space-between">
      <Text
        variant="subtitle"
        fontSize={12}
        color="grey.250"
        fontWeight={400}
        display="flex"
        alignItems="center"
        gap={2}
      >
        Reserved amount{' '}
        <Tooltip
          label="Amount information"
          fontSize="xs"
          bg="grey.825"
          rounded={8}
          placement="auto-start"
        >
          <Icon color="grey.200" boxSize="12px" as={TooltipIcon} />
        </Tooltip>
      </Text>
      <Text variant="subtitle" fontSize={12} color="grey.250" fontWeight={400}>
        {reservedAmount} ETH
      </Text>
    </HStack>
  );

export { DappTransactionReservedAmount };
