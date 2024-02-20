import { Avatar, Box, HStack, Text } from '@chakra-ui/react';

import { Card } from '@/components';
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
        <Card key={asset.assetId} as={HStack} w="full" borderTopRadius={0}>
          <Avatar
            color="white"
            size={asset.icon ? 'sm' : 'md'}
            bgColor={asset.icon ? 'transparent' : 'dark.150'}
            variant="roundedSquare"
            src={asset.icon}
            name={asset.name}
          />
          <Box w="full">
            <Text variant="subtitle">{asset.name}</Text>
            <Text variant="description">
              {AddressUtils.format(asset.assetId)}
            </Text>
          </Box>
          <Box minW="max-content">
            <Text variant="subtitle">
              {asset.amount} {asset.slug}
            </Text>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export { DappTransactionAsset };
