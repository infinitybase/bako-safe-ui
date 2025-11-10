import { HStack, Text, Tooltip } from 'bako-ui';
import { useState } from 'react';

import { TooltipIcon } from '@/components/icons/tooltip';

export interface FeeProps {
  fee?: string;
  isLoading?: boolean;
}

const DappTransactionFee = ({ fee, isLoading }: FeeProps) => {
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const handleClose = () => setTooltipOpen(false);
  const handleOpen = () => setTooltipOpen(true);

  return isLoading || !fee ? null : (
    <HStack
      w="full"
      justifyContent="space-between"
    >
      <Text
        fontSize={12}
        color="gray.400"
        fontWeight={400}
        display="flex"
        alignItems="center"
        gap={2}
      >
        Max fee
        <Tooltip
          open={isTooltipOpen}
          content="The amount shown is the maximum fee you will be charged for this transaction. There won't be any extra costs."
          positioning={{ placement: 'top-end' }}
        >
          <TooltipIcon
            color="gray.200"
            boxSize="14px"
            onClick={handleOpen}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          />
        </Tooltip>
      </Text>
      <Text
        fontSize={12}
        color="gray.100"
        fontWeight={500}
      >
        {fee} ETH
      </Text>
    </HStack>
  );
};

export { DappTransactionFee };
