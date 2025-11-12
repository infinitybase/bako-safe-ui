import {
  Avatar,
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
  VStack,
} from 'bako-ui';
import { useCallback } from 'react';
import { PiCopyThin } from 'react-icons/pi';

import { AddressUtils } from '@/modules/core';

interface AddressDisplayProps {
  address: string;
  name?: string;
  isCurrentAccount: boolean;
  vaultAddress?: string;
  onCopy: () => void;
  hasCopied: boolean;
}

export const OperationAddressDisplay = ({
  address,
  name,
  isCurrentAccount,
  vaultAddress,
  onCopy,
  hasCopied,
}: AddressDisplayProps) => {
  const handleCopy = useCallback(() => {
    if (isCurrentAccount && vaultAddress) {
      onCopy();
    } else {
      navigator.clipboard.writeText(address);
    }
  }, [isCurrentAccount, vaultAddress, onCopy, address]);
  return (
    <Flex w="full" alignItems="center" bg="gray.700" borderRadius={8} p={4}>
      <HStack gap={3} align="center">
        <Avatar
          shape="rounded"
          color="gray.100"
          bgColor="gray.500"
          boxSize="36px"
          size="xs"
          name={name ?? '?'}
        />
        <VStack gap={2} align="flex-start">
          {name && (
            <Text
              fontWeight={500}
              color="gray.100"
              fontSize="xs"
              lineHeight="12px"
            >
              {name}
            </Text>
          )}
          <Flex align="center" gap={1}>
            <Text
              fontWeight={name ? 400 : 500}
              color={name ? 'gray.400' : 'gray.100'}
              fontSize="xs"
              lineHeight="12px"
            >
              {AddressUtils.format(address, 15)}
            </Text>
            <Tooltip content={hasCopied ? 'Copied!' : 'Copy'} closeOnClick>
              <IconButton
                aria-label="Copy address"
                size="xs"
                boxSize="12px"
                onClick={handleCopy}
                color="gray.400"
                variant="ghost"
                _hover={{ background: 'transparent' }}
                _active={{ background: 'transparent' }}
                _focus={{ boxShadow: 'none' }}
              >
                <PiCopyThin />
              </IconButton>
            </Tooltip>
          </Flex>
        </VStack>
      </HStack>
    </Flex>
  );
};
