import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';

import { TooltipIcon } from '@/components/icons/tooltip';

export interface FeeProps {
  fee?: string;
  isLoading?: boolean;
}

const DappTransactionFee = ({ fee, isLoading }: FeeProps) =>
  isLoading || !fee ? null : (
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
        Estimated fee
        <Tooltip
          label="Fee information"
          fontSize="xs"
          bg="grey.825"
          rounded={8}
        >
          <Icon color="grey.200" boxSize="12px" as={TooltipIcon} />
        </Tooltip>
      </Text>
      <Text variant="subtitle" fontSize={12} color="grey.250" fontWeight={400}>
        {fee} ETH
      </Text>
    </HStack>
  );

export { DappTransactionFee };
