import { HStack, Icon, Text, useClipboard, VStack } from 'bako-ui';

import { CheckIcon, CopyIcon } from '@/components/icons';
import { AddressUtils } from '@/modules/core/utils/address';

interface CopyAddressProps {
  address: string;
  onClose?: () => void;
}

const CopyAddress = ({ address, onClose }: CopyAddressProps) => {
  const clipboard = useClipboard({ value: address });

  return (
    <HStack
      gap={4}
      px={4}
      py={3}
      cursor="pointer"
      onClick={() => {
        clipboard.copy();
        setTimeout(() => onClose?.(), 600);
      }}
    >
      <Icon
        as={clipboard.copied ? CheckIcon : CopyIcon}
        color={clipboard.copied ? 'success.700' : 'grey.50'}
        fontSize="lg"
      />
      <VStack alignItems="flex-start" gap={0} fontSize="xs">
        <Text color="grey.50">Copy address</Text>
        <Text color="grey.425">{AddressUtils.format(address)}</Text>
      </VStack>
    </HStack>
  );
};

export { CopyAddress };
