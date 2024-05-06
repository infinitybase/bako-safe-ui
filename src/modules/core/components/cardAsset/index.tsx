import {
  Avatar,
  Box,
  Card,
  CardProps,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useScreenSize } from '../../hooks';
import { Asset, assetsMap, NativeAssetId } from '../../utils';

interface DefaultAsset {
  assetId: string;
  amount: string;
  name: string;
  slug: string;
  icon?: string | undefined;
}

interface AssetDetailsProps {
  asset: Asset;
  defaultAsset: DefaultAsset;
}

interface AssetCardProps extends CardProps {
  asset: Asset;
  visibleBalance?: boolean;
}

const AssetDetails = ({ asset, defaultAsset }: AssetDetailsProps) => {
  return (
    <Box>
      <Text color="grey.100" fontSize={{ base: 'sm', sm: 15 }} noOfLines={2}>
        {asset.name ?? defaultAsset.name}
      </Text>

      <Text
        fontWeight="bold"
        fontSize={{ base: 'sm', sm: 15 }}
        color="grey.400"
      >
        {asset.slug ?? defaultAsset.slug}
      </Text>
    </Box>
  );
};

const AssetCard = ({ asset, visibleBalance, ...rest }: AssetCardProps) => {
  const { isMobile } = useScreenSize();

  const defaultAsset = {
    ...assetsMap[NativeAssetId],
    assetId: NativeAssetId,
    amount: `0`,
  };

  return (
    <Card
      bgColor="grey.700"
      cursor="pointer"
      borderColor="grey.400"
      borderWidth="2px"
      borderRadius={10}
      px={{ base: 4, sm: 6 }}
      py={4}
      w="full"
      h={{ base: undefined, sm: 150 }}
      {...rest}
    >
      <HStack gap={2} alignItems="center" mb={{ base: 1, sm: 4 }}>
        <Avatar
          w={{ base: 8, sm: 10 }}
          h={{ base: 8, sm: 10 }}
          name={asset.slug}
          src={asset.icon ?? defaultAsset.icon}
        />

        {isMobile && <AssetDetails asset={asset} defaultAsset={defaultAsset} />}
      </HStack>

      <VStack
        display="flex"
        alignItems="flex-start"
        flexDirection="column"
        justifyContent="center"
        spacing={1}
        gap={-1}
      >
        {visibleBalance ? (
          <Text fontWeight="bold" color="white" maxW={360} isTruncated>
            {asset.amount ?? defaultAsset.amount}
          </Text>
        ) : (
          <Text color="white" fontSize="md" mr={1}>
            ------
          </Text>
        )}

        {!isMobile && (
          <AssetDetails asset={asset} defaultAsset={defaultAsset} />
        )}
      </VStack>
    </Card>
  );
};

export { AssetCard };
