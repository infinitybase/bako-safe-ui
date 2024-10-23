import {
  Icon,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Tooltip as ChakraTooltip,
  useDisclosure,
} from "@chakra-ui/react";

import { TooltipIcon } from "@/components/icons/tooltip";

export interface TooltipProps {
  text: string;
  isMobile: boolean;
  placment?: "top-start" | "top-end";
}

const Tooltip = ({ text, placment, isMobile }: TooltipProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <div>
      {isMobile ? (
        <Popover
          placement={placment ?? "top-start"}
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
            py={4}
            px={2}
            borderColor="dark.100"
            maxW={270}
            display={!isOpen ? "none" : "block"}
            _focus={{ ring: "none" }}
          >
            <PopoverCloseButton />
            <PopoverBody color="white">
              {text ??
                `Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network.`}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : (
        <ChakraTooltip
          label={
            text ??
            "Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network."
          }
          fontSize="xs"
          bg="grey.825"
          rounded={8}
          maxW={270}
          overflow="hidden"
          placement={placment ?? "top-start"}
          padding={4}
          closeOnScroll
        >
          <Icon color="grey.200" boxSize="14px" as={TooltipIcon} />
        </ChakraTooltip>
      )}
    </div>
  );
};
export { Tooltip };
