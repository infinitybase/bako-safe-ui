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
}

export interface AssetInfoProps {
  asset: AssetInfo;
}

const FUEL_ASSET = {
  name: 'Fuel',
  slug: 'FUEL',
  icon: 'https://verified-assets.fuel.network/images/fuel.svg',
  assetId: '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
};

const DappTransactionAssetInfo = ({ asset }: AssetInfoProps) => {
  const assetInfo = useMemo(() => {
    if (asset.assetId === FUEL_ASSET.assetId) {
      return { ...FUEL_ASSET, amount: asset.amount };
    }
    return asset;
  }, [asset]);

  return (
    <Card
      key={assetInfo.assetId}
      as={HStack}
      w="full"
      borderRadius={8}
      bg="grey.850"
      px={4}
      py={3}
      maxW={356}
      alignItems="center"
      justifyContent="space-between"
      gap={3}
    >
      <HStack maxW="200px" alignItems="center" spacing={3}>
        <Image
          boxSize={6}
          src={assetInfo.icon ?? ''}
          borderRadius="full"
          alt="Asset Icon"
          objectFit="cover"
        />
        <VStack spacing={0} align="start">
          <Text variant="subtitle" fontSize="xs" color="grey.50">
            {assetInfo.name}
          </Text>
          <AddressCopy
            flexDir="row-reverse"
            address={AddressUtils.format(assetInfo.assetId)!}
            fontSize="10px"
            addressToCopy={assetInfo.assetId}
            bg="transparent"
            spacing={1}
            p={0}
          />
        </VStack>
      </HStack>

      <Box textAlign="right">
        <Text variant="subtitle" fontSize="xs" color="grey.50">
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
    <VStack w="full" spacing={3} align="stretch">
      {assets.map((asset) => (
        <DappTransactionAssetInfo key={asset.assetId} asset={asset} />
      ))}
    </VStack>
  );
};

export { DappTransactionAsset };
