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
          positioning={{
            placement: placment ?? 'top-start',
          }}
          open={isOpen}
          onOpenChange={onOpenChange}
        >
          <Popover.Trigger>
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
              maxW={270}
              display={!isOpen ? 'none' : 'block'}
              _focus={{ ring: 'none' }}
            >
              <Popover.Body color="textPrimary">
                {text ??
                  `Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network.`}
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      ) : (
        <ChakraTooltip
          content={
            text ??
            'Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network.'
          }
          contentProps={{
            bg: 'bg.muted',
            color: 'textPrimary',
          }}
          positioning={{ placement: placment ?? 'top-start' }}
          closeOnScroll
        >
          <Icon color="grey.200" boxSize="14px" as={TooltipIcon} />
        </ChakraTooltip>
      )}
    </div>
  );
};
export { Tooltip };
