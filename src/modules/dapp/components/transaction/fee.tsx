import {
  HStack,
  Icon,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import { TooltipIcon } from '@/components/icons/tooltip';

import { useVerifyBrowserType } from '../../hooks';

export interface FeeProps {
  fee?: string;
  isLoading?: boolean;
  closePopover: boolean;
}

const DappTransactionFee = ({ fee, isLoading, closePopover }: FeeProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  useEffect(() => {
    if (closePopover && isOpen) {
      onToggle();
    }
  }, [closePopover]);

  const { isMobile } = useVerifyBrowserType();

  return isLoading || !fee ? null : (
    <HStack display="flex" justifyContent="space-between">
      <Text
        variant="subtitle"
        fontSize={14}
        color="grey.250"
        fontWeight={400}
        display="flex"
        alignItems="center"
        gap={2}
      >
        Max Fee
        {isMobile ? (
          <Popover
            placement="top-start"
            autoFocus={false}
            isOpen={isOpen}
            onClose={onClose}
          >
            <PopoverTrigger>
              <Icon
                color="grey.200"
                boxSize="14px"
                as={TooltipIcon}
                onClick={onToggle}
              />
            </PopoverTrigger>
            <PopoverContent
              bg="grey.825"
              pt={5}
              border="none"
              maxW={270}
              display={!isOpen ? 'none' : 'block'}
            >
              <PopoverCloseButton />
              <PopoverBody>
                {`The amount shown is the maximum fee you will be charged for
                  this transaction. There won't be any extra costs.`}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          <Tooltip
            label="The amount shown is the maximum fee you will be charged for this transaction. There won't be any extra costs."
            fontSize="xs"
            bg="grey.825"
            rounded={8}
            maxW={270}
            overflow="hidden"
            placement="top-end"
            closeOnScroll
          >
            <Icon color="grey.200" boxSize="14px" as={TooltipIcon} />
          </Tooltip>
        )}
      </Text>
      <Text variant="subtitle" fontSize={14} color="grey.250" fontWeight={400}>
        {fee} ETH
      </Text>
    </HStack>
  );
};

export { DappTransactionFee };
