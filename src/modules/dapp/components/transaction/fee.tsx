import { HStack, Icon, Popover, Text, Tooltip } from 'bako-ui';
import { useEffect } from 'react';

import { TooltipIcon } from '@/components/icons/tooltip';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

import { useVerifyBrowserType } from '../../hooks';

export interface FeeProps {
  fee?: string;
  isLoading?: boolean;
  closePopover: boolean;
}

const DappTransactionFee = ({ fee, isLoading, closePopover }: FeeProps) => {
  const { isOpen, onToggle, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (closePopover && isOpen) {
      onToggle();
    }
  }, [closePopover]);

  const { isMobile } = useVerifyBrowserType();

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
        {isMobile ? ( // TODO ASDF > implementar o estilo do tooltip pra mobile
          <Popover.Root
            positioning={{ placement: 'top-start' }}
            open={isOpen}
            onOpenChange={onOpenChange}
          >
            <Popover.Trigger>
              <Icon
                color="grey.200"
                boxSize="14px"
                as={TooltipIcon}
                onClick={onToggle}
              />
            </Popover.Trigger>
            <Popover.Content
              bg="grey.825"
              p={4}
              borderColor="dark.100"
              maxW={270}
              display={!isOpen ? 'none' : 'block'}
              _focus={{ ring: 'none' }}
            >
              <Popover.CloseTrigger />
              <Popover.Body>
                {`The amount shown is the maximum fee you will be charged for
                  this transaction. There won't be any extra costs.`}
              </Popover.Body>
            </Popover.Content>
          </Popover.Root>
        ) : (
          <Tooltip
            content="The amount shown is the maximum fee you will be charged for this transaction. There won't be any extra costs."
            // fontSize="xs"
            // bg="grey.825"
            // rounded={8}
            // maxW={270}
            // overflow="hidden"
            positioning={{ placement: 'top-end' }}
            closeOnScroll
          >
            <Icon color="grey.200" boxSize="14px" as={TooltipIcon} />
          </Tooltip>
        )}
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
