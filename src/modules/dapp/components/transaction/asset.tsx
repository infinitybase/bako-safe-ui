import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Card } from '@/components';
import { AddressCopy } from '@/components/addressCopy';
import { AddressUtils } from '@/modules/core/utils';

interface AssetInfo {
  icon?: string;
  amount: string;
  assetId: string;
  name: string;
  slug: string;
  image?: string | null;
}

export interface AssetInfoProps {
  asset: AssetInfo;
}

// TODO: Remove this mock data and get the real data from the API
const FUEL_ASSET = {
  name: 'Fuel',
  slug: 'FUEL',
  image: 'https://verified-assets.fuel.network/images/fuel.svg',
  assetId: '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
};

const DappTransactionAssetInfo = ({ asset }: AssetInfoProps) => {
  const assetInfo = useMemo(() => {
    if (asset && asset.assetId === FUEL_ASSET.assetId) {
      return {
        ...FUEL_ASSET,
        amount: asset.amount,
      };
    }
    return asset;
  }, [asset]);

  return (
    <Card
      key={assetInfo.assetId}
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
          w={7}
          h={7}
          src={assetInfo?.image ?? ''}
          borderRadius="md"
          alt="Asset Icon"
          objectFit="cover"
        />
        <VStack gap={0}>
          <Text
            variant="subtitle"
            fontSize={12}
            color="grey.75"
            alignSelf="start"
          >
            {assetInfo.name}
          </Text>
          <AddressCopy
            flexDir="row-reverse"
            address={AddressUtils.format(assetInfo.assetId)!}
            fontSize="xs"
            addressToCopy={assetInfo.assetId}
            w="100%"
            bg="transparent"
            gap={2}
            p={0}
          />
        </VStack>
      </HStack>
      <Box minW="max-content" mt={4}>
        <Text variant="subtitle" color="grey.75" fontSize="xs">
          {assetInfo.amount} {assetInfo.slug}
        </Text>
      </Box>
    </Card>
  );
};

export interface FeeProps {
  assets: AssetInfo[];
}

const DappTransactionAsset = ({ assets }: FeeProps) => {
  return (
    <Box w="full">
      {assets.map((asset) => (
        <DappTransactionAssetInfo key={asset.assetId} asset={asset} />
      ))}
    </Box>
  );
};

export { DappTransactionAsset };
