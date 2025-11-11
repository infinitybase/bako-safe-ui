import { HStack, Icon, Text, useClipboard } from 'bako-ui';

import { CheckIcon, CopyIcon } from '@/components/icons';

interface CopyAddressProps {
  address: string;
  onClose?: () => void;
}

const CopyAddress = ({ address, onClose }: CopyAddressProps) => {
  const clipboard = useClipboard({ value: address });

  return (
    <HStack
      gap={3}
      p={3}
      cursor="pointer"
      onClick={() => {
        clipboard.copy();
        setTimeout(() => onClose?.(), 600);
      }}
    >
      <Icon
        as={clipboard.copied ? CheckIcon : CopyIcon}
        color={clipboard.copied ? 'gray.50' : 'gray.200'}
        boxSize={3}
      />
      <Text color="gray.200" fontSize="xs">
        Copy address
      </Text>
    </HStack>
  );
};

export { CopyAddress };
