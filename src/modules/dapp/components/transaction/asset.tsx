import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';

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
          alignItems="center"
          gap={4}
        >
          <HStack maxW="190px">
            <Image
              w={{ base: 8, sm: 10 }}
              h={{ base: 8, sm: 10 }}
              src={asset?.icon ?? ''}
              alt="Asset Icon"
              objectFit="cover"
            />
            <VStack spacing={0}>
              <Text
                variant="subtitle"
                fontSize={12}
                color="grey.75"
                alignSelf="start"
              >
                {asset.name}
              </Text>
              <AddressCopy
                flexDir="row-reverse"
                address={AddressUtils.format(asset.assetId)!}
                fontSize={asset?.slug === 'UNK' ? '12px' : 'unset'}
                addressToCopy={asset.assetId}
                w="100%"
                bg="transparent"
                p={0}
              />
            </VStack>
          </HStack>
          <Box minW="max-content" mt={4}>
            <Text
              variant="subtitle"
              color="grey.75"
              fontSize={asset.amount.length >= 8 ? 'xs' : 'sm'}
            >
              {asset.amount} {asset.slug}
            </Text>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export { DappTransactionAsset };
