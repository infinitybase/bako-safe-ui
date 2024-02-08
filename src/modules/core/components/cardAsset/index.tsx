import { Avatar, Card, CardProps, Text, VStack } from '@chakra-ui/react';

import { Asset, assetsMap, NativeAssetId } from '../../utils';

interface AssetCardProps extends CardProps {
  asset: Asset;
}

const AssetCard = ({ asset, ...rest }: AssetCardProps) => {
  const defaultAsset = {
    ...assetsMap[NativeAssetId],
    assetId: NativeAssetId,
    amount: `0`,
  };

  return (
    <Card
      bgColor="dark.300"
      cursor="pointer"
      borderColor="dark.100"
      borderWidth="1px"
      borderRadius={10}
      px={6}
      py={4}
      w="full"
      h={130}
      {...rest}
    >
      <VStack
        h="full"
        spacing={1}
        display="flex"
        alignItems="center"
        flexDirection="row"
        justifyContent="center"
        gap={4}
      >
        <Avatar
          w={10}
          h={10}
          variant="roundedSquare"
          src={asset.icon ?? defaultAsset.icon}
        />

        <VStack flex={1} spacing={1.5} alignItems="flex-start">
          <Text color="grey.500" fontSize={15} noOfLines={2}>
            {asset.name ?? defaultAsset.name}
          </Text>

          <Text fontWeight="bold" fontSize={15} color="grey.200">
            {asset.slug ?? defaultAsset.slug}
          </Text>
        </VStack>

        <Text fontWeight="bold" color="grey.200" maxW={360} isTruncated>
          {asset.amount ?? defaultAsset.amount}
        </Text>
      </VStack>
    </Card>
  );
};

export { AssetCard };
