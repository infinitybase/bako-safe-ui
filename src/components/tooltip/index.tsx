import { Icon, Popover } from 'bako-ui';

import { TooltipIcon } from '@/components/icons/tooltip';
import { Tooltip as ChakraTooltip } from '@/components/ui/tooltip';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';

export interface TooltipProps {
  text: string;
  placment?: 'top-start' | 'top-end';
}

const Tooltip = ({ text, placment }: TooltipProps) => {
  const { isOpen, onToggle, onOpenChange } = useDisclosure();
  const { isMobile } = useVerifyBrowserType();

  return (
    <div>
      {isMobile ? (
        <Popover.Root
          positioning={{ placement: placment ?? 'top-start' }}
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
            py={4}
            px={2}
            borderColor="dark.100"
            maxW={270}
            display={!isOpen ? 'none' : 'block'}
            _focus={{ ring: 'none' }}
          >
            <Popover.CloseTrigger />
            <Popover.Body color="white">
              {text ??
                `Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network.`}
            </Popover.Body>
          </Popover.Content>
        </Popover.Root>
      ) : (
        <ChakraTooltip
          content={
            text ??
            'Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network.'
          }
          // fontSize="xs"
          // bg="grey.825"
          // rounded={8}
          // maxW={270}
          // overflow="hidden"
          positioning={{ placement: placment ?? 'top-start' }}
          // padding={4}
          closeOnScroll
        >
          <Icon color="grey.200" boxSize="14px" as={TooltipIcon} />
        </ChakraTooltip>
      )}
    </div>
  );
};
export { Tooltip };
