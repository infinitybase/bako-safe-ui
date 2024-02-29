import { Avatar, Card, CardProps, Text, VStack } from '@chakra-ui/react';

import { Asset, assetsMap, NativeAssetId } from '../../utils';

interface AssetCardProps extends CardProps {
  asset: Asset;
  visibleBalance?: boolean;
}

const AssetCard = ({ asset, visibleBalance, ...rest }: AssetCardProps) => {
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
      px={6}
      py={4}
      w="full"
      h={150}
      {...rest}
    >
      <Avatar
        w={10}
        h={10}
        mb={3}
        variant="roundedSquare"
        src={asset.icon ?? defaultAsset.icon}
      />

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

        <Text color="grey.100" mt={1} fontSize={15} noOfLines={2}>
          {asset.name ?? defaultAsset.name}
        </Text>

        <Text fontWeight="bold" fontSize={15} color="grey.400">
          {asset.slug ?? defaultAsset.slug}
        </Text>
      </VStack>
    </Card>
  );
};

export { AssetCard };
