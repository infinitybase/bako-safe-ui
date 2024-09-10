import {
  Box,
  ComponentWithAs,
  HStack,
  Icon,
  IconProps,
  Text,
} from '@chakra-ui/react';

import { Card, UnknownIcon } from '@/components';
import { AddressCopy } from '@/components/addressCopy';
import { AddressUtils } from '@/modules/core/utils';

export interface FeeProps {
  assets: {
    icon?: ComponentWithAs<'svg', IconProps>;
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
          <Icon
            w={{ base: 6, sm: 6 }}
            h={{ base: 6, sm: 6 }}
            as={asset?.icon ?? UnknownIcon}
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
