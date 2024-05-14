import { Avatar, Box, HStack, Text } from '@chakra-ui/react';

import { Card } from '@/components';
import { AddressCopy } from '@/components/addressCopy';
import { AddressUtils } from '@/modules/core/utils';

export interface FeeProps {
  assets: {
    icon?: string;
    amount: string;
    assetId: string;
    name: string;
    slug: string;
  }[];
}

const DappTransactionAsset = ({ assets }: FeeProps) => {
  return (
    <Box w="full">
      {assets.map((asset) => (
        <Card
          key={asset.assetId}
          as={HStack}
          w="full"
          borderTopRadius={0}
          bg="grey.825"
          px={3}
          maxW={356}
        >
          <Avatar
            color="white"
            bgColor={asset.icon ? 'transparent' : 'grey.950'}
            variant="roundedSquare"
            src={asset.icon}
            name={asset.name}
            boxSize={10}
          />
          <Box w="full">
            <Text variant="subtitle" fontSize={12} color="grey.75">
              {asset.name}
            </Text>
            <AddressCopy
              flexDir="row-reverse"
              address={AddressUtils.format(asset.assetId)!}
              addressToCopy={asset.assetId}
              bg="transparent"
              fontSize={14}
              p={0}
              pr={8}
            />
          </Box>
          <Box minW="max-content">
            <Text variant="subtitle" color="grey.75" fontSize="sm">
              {asset.amount} {asset.slug}
            </Text>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export { DappTransactionAsset };
