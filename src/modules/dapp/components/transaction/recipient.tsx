import { Avatar, Center, chakra, Divider, Text } from '@chakra-ui/react';
import { AddressType, ChainName } from '@fuel-ts/providers';
import { Vault } from 'bsafe';
import React from 'react';

import { Card } from '@/components';
import { AddressUtils } from '@/modules/core';

interface RecipientProps {
  type: AddressType;
  address: string;
  isSender?: boolean;
  vault?: Pick<Vault['BSAFEVault'], 'name' | 'predicateAddress'>;
  /* TODO: Check chain name to show is ETH or Fuel */
  chain?: ChainName;
  fullBorderRadius?: boolean;
}

export const RecipientCard = chakra(Card, {
  baseStyle: {
    py: 4,
    w: 'full',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    minH: '100%',
    alignSelf: 'stretch',
  },
});

const DappTransactionRecipient = ({
  type,
  address,
  vault,
  isSender,
  fullBorderRadius,
}: RecipientProps) => {
  const bech32Address = address;

  const isVault = bech32Address === vault?.predicateAddress;
  const isContract = type === AddressType.contract;
  const title = isVault ? vault?.name : 'Unknown';

  return (
    <RecipientCard borderBottomRadius={fullBorderRadius ? 10 : 0}>
      <Text variant="description" textAlign="center">
        {isSender ? 'From' : 'To'}
        {isContract && !isVault && '(Contract)'}
        {isVault && '(Bako Safe)'}:
      </Text>
      <Divider borderColor="dark.100" mt={2} mb={4} />
      <Center flexDirection="column">
        <Avatar
          mb={2}
          name={title}
          color="white"
          bgColor="dark.150"
          variant="roundedSquare"
        />
        <Text textAlign="center" variant="title">
          {title}
        </Text>
        <Text textAlign="center" variant="description">
          {AddressUtils.format(bech32Address ?? '')}
        </Text>
      </Center>
    </RecipientCard>
  );
};

export { DappTransactionRecipient };
