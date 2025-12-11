import { Center, Flex, HStack, Icon, Popover, Text } from 'bako-ui';
import { memo } from 'react';

import { ChevronRightIcon } from '@/components';
import { TooltipIcon } from '@/components/icons/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { useScreenSize } from '@/modules';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

export const FeeSummary = memo(
  ({ transactionFee }: { transactionFee: string | undefined }) => {
    const { isMobile } = useScreenSize();
    const { isOpen, onToggle, onOpenChange } = useDisclosure();

    return (
      <Flex
        wrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        w="full"
        mb={{ base: 3, sm: 6 }}
        mt={0.5}
      >
        <HStack align="center" gap={1}>
          <Text
            visibility={!transactionFee ? 'hidden' : 'visible'}
            fontSize="xs"
          >
            Max fee:
          </Text>
          <Center>
            {isMobile ? (
              <Popover.Root
                positioning={{
                  placement: 'top-start',
                  strategy: 'fixed',
                  hideWhenDetached: true,
                }}
                open={isOpen}
                onOpenChange={onOpenChange}
              >
                <Popover.Trigger
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    color="textPrimary"
                    boxSize="14px"
                    as={TooltipIcon}
                    onClick={onToggle}
                  />
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content
                    bg="bg.muted"
                    p={2}
                    borderColor="bg.panel/80"
                    maxW={270}
                    display={!isOpen ? 'none' : 'block'}
                    _focus={{ ring: 'none' }}
                  >
                    <Popover.Body color="white">
                      {`Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network.`}
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            ) : (
              <Tooltip
                content="Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network."
                // fontSize="xs"
                // bg="grey.825"
                // rounded={8}
                // maxW={270}
                // overflow="hidden"
                positioning={{ placement: 'top-start' }}
                // padding={4}
                closeOnScroll
              >
                <Icon color="gray.200" boxSize="14px" as={TooltipIcon} />
              </Tooltip>
            )}
          </Center>
        </HStack>
        <HStack align="center" gap={1}>
          <Flex align="center" justifyContent="center">
            {transactionFee && (
              <ChevronRightIcon boxSize={4} transform="rotate(180deg)" />
            )}
          </Flex>
          <Text fontSize="xs">{transactionFee && `${transactionFee} ETH`}</Text>
        </HStack>
      </Flex>
    );
  },
);

FeeSummary.displayName = 'FeeSummary';
