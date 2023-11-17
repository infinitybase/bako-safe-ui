import { Avatar, Center, Divider, Text } from '@chakra-ui/react';
import { AddressType, ChainName } from '@fuel-ts/providers';
import React from 'react';

import { Card } from '@/components';

interface RecipientProps {
  type?: AddressType;
  address?: string;
  isVault?: boolean;
  isSender?: boolean;
  vaultName?: string;
  /* TODO: Check chain name to show is ETH or Fuel */
  chain?: ChainName;
}

const DappTransactionRecipient = ({
  type,
  address,
  vaultName,
  isSender,
}: RecipientProps) => {
  const isContract = type === AddressType.contract;
  const title = vaultName || 'Unknown';

  return (
    <Card
      display="flex"
      flexDirection="column"
      alignItems="center"
      borderBottomRadius={0}
      py={4}
      w="full"
    >
      <Text variant="description" textAlign="center">
        {isSender ? 'From' : 'To'} {isContract && '(Contract)'}:
      </Text>
      <Divider borderColor="dark.100" mt={2} mb={4} />
      <Center flexDirection="column">
        <Avatar
          mb={2}
          name="EA"
          color="white"
          bgColor="dark.150"
          variant="roundedSquare"
        />
        <Text textAlign="center" variant="title">
          {title}
        </Text>
        <Text textAlign="center" variant="description">
          {address}
        </Text>
      </Center>
    </Card>
  );
};

export { DappTransactionRecipient };
