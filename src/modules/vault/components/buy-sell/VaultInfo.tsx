import { Avatar, Box, Flex, Text } from 'bako-ui';

import { CopyAddressButton } from '@/components';

import { CardRoot } from './CardRoot';

export const VaultInfo = ({
  name,
  address,
}: {
  name: string;
  address: string;
}) => {
  return (
    <CardRoot>
      <Text color="section.500" fontSize="sm">
        Vault
      </Text>
      <Flex gap={3} alignItems="center">
        <Avatar size="sm" name={name} bg="grey.950" borderRadius="lg" />
        <Box>
          <Text color="section.200">{name}</Text>

          <Flex alignItems="center" gap={1}>
            <Text fontSize="sm" color="section.500">
              {address.slice(0, 4)}...{address.slice(-4)}
            </Text>
            <CopyAddressButton
              aria-label="Copy vault address"
              addressToCopy={address}
              fontSize="sm"
              size="sm"
              height={5}
            />
          </Flex>
        </Box>
      </Flex>
    </CardRoot>
  );
};
