import { Avatar, Center, chakra, Separator, Text } from '@chakra-ui/react';
import { AddressType, ChainName } from 'fuels';

import { AddressCopy } from '@/components/addressCopy';
import { Card } from '@/components/card';
import { AddressUtils } from '@/modules/core';
import { PredicateAndWorkspace } from '@/modules/vault';

interface RecipientProps {
  type: AddressType;
  address: string;
  isSender?: boolean;
  vault?: Pick<PredicateAndWorkspace, 'name' | 'predicateAddress'>;
  /* TODO: Check chain name to show is ETH or Fuel */
  chain?: ChainName;
  fullBorderRadius?: boolean;
}

export const RecipientCard = chakra(Card, {
  base: {
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
    <RecipientCard
      borderBottomRadius={fullBorderRadius ? 10 : 0}
      bg="grey.825"
      h={149}
      w={174}
    >
      <Text textAlign="center" mt={-2} color="grey.250">
        {isSender ? 'From' : 'To'}
        {(!isSender && isContract && '(Contract)') ||
          (!isSender && isContract && !isVault && '(Contract)')}
        {isVault && '(Bako Safe)'}:
      </Text>
      <Separator borderColor="dark.100" mt={1} mb="10px" />
      <Center flexDirection="column" h={88}>
        <Avatar.Root
          mb={2}
          color="white"
          bgColor="grey.950"
          shape="rounded"
          boxSize="40px"
        >
          <Avatar.Fallback name={title} />
        </Avatar.Root>
        <Text textAlign="center" mb={1} fontSize={14}>
          {title}
        </Text>

        <AddressCopy
          flexDir="row-reverse"
          address={AddressUtils.format(bech32Address ?? '')!}
          addressToCopy={bech32Address}
          bg="transparent"
          fontSize={14}
          p={0}
          gap={3}
        />
      </Center>
    </RecipientCard>
  );
};

export { DappTransactionRecipient };
