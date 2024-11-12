import { HStack, Icon, Text, useClipboard, VStack } from '@chakra-ui/react';

import { CheckIcon, CopyIcon } from '@/components/icons';
import { AddressUtils } from '@/modules/core/utils/address';

interface CopyAddressProps {
  address: string;
  onClose: () => void;
}

const CopyAddress = ({ address, onClose }: CopyAddressProps) => {
  const clipboard = useClipboard(address);

  return (
    <HStack
      spacing={4}
      px={4}
      py={3}
      cursor="pointer"
      onClick={() => {
        clipboard.onCopy();
        setTimeout(() => onClose(), 600);
      }}
    >
      <Icon
        as={clipboard.hasCopied ? CheckIcon : CopyIcon}
        color={clipboard.hasCopied ? 'success.700' : 'grey.50'}
        fontSize="lg"
      />
      <VStack alignItems="flex-start" spacing={0} fontSize="xs">
        <Text color="grey.50">Copy address</Text>
        <Text color="grey.425">{AddressUtils.format(address)}</Text>
      </VStack>
    </HStack>
  );
};

export { CopyAddress };
