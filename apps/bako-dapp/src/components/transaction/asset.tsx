import { Card } from '@bako-safe/ui';
import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';

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
          justifyContent="space-between"
          gap={4}
        >
          <HStack maxW="190px">
            <Image
              w={6}
              h={6}
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
              {/* <AddressCopy
                flexDir="row-reverse"
                address={AddressUtils.format(asset.assetId)!}
                fontSize="xs"
                addressToCopy={asset.assetId}
                w="100%"
                bg="transparent"
                spacing={2}
                p={0}
              /> */}
            </VStack>
          </HStack>
          <Box minW="max-content" mt={4}>
            <Text variant="subtitle" color="grey.75" fontSize="xs">
              {asset.amount} {asset.slug}
            </Text>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export { DappTransactionAsset };
