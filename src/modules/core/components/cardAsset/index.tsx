import {
  Avatar,
  Box,
  Card,
  CardProps,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Asset, assetsMap, NativeAssetId } from '../../utils';
import { useGetTokensIcon } from '../../hooks';

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
    <Box maxW={{ base: '70%', lg: 'full' }}>
      <Text color="grey.100" fontSize={{ base: 'sm', sm: 15 }} isTruncated>
        {asset.name ?? defaultAsset.name}
      </Text>

      <Text fontWeight="bold" fontSize="xs" color="grey.400">
        {asset.slug ?? defaultAsset.slug}
      </Text>
    </Box>
  );
};

const AssetCard = ({ asset, visibleBalance, ...rest }: AssetCardProps) => {
  const defaultAsset = {
    ...assetsMap[NativeAssetId],
    assetId: NativeAssetId,
    amount: `0`,
  };

  const assetIcon = useGetTokensIcon(asset.assetId);

  return (
    <Card
      bgColor="grey.700"
      cursor="pointer"
      borderColor="grey.400"
      borderWidth="1px"
      borderRadius={10}
      px={4}
      py={4}
      w="full"
      h="full"
      {...rest}
    >
      <Flex
        direction={{ base: 'row', lg: 'column' }}
        alignItems="flex-start"
        gap={2}
        mb={1}
      >
        <Avatar
          w={{ base: 8, sm: 10 }}
          h={{ base: 8, sm: 10 }}
          name={asset.slug}
          src={assetIcon ?? defaultAsset.icon}
          ignoreFallback
        />

        <AssetDetails asset={asset} defaultAsset={defaultAsset} />
      </Flex>

      <VStack
        display="flex"
        alignItems="flex-start"
        flexDirection="column"
        justifyContent="center"
        spacing={1}
        gap={-1}
      >
        {visibleBalance ? (
          <Text fontWeight="bold" color="white" maxW="100%" isTruncated>
            {asset.amount ?? defaultAsset.amount}
          </Text>
        ) : (
          <Text color="white" fontSize="md" mr={1}>
            ------
          </Text>
        )}
      </VStack>
    </Card>
  );
};

export { AssetCard };
