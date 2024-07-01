import { Avatar, Card, Grid, Text, VStack } from '@chakra-ui/react';

import BakoIcon from '@/assets/tokens/bako.svg';
import { Asset } from '@/modules/core/utils';

interface AssetsBalanceProps {
  assets: Asset[];
}

interface AssetsBalanceCardProps {
  asset: Asset;
}

const AssetsBalanceCard = ({ asset }: AssetsBalanceCardProps) => {
  return (
    <Card
      p={4}
      borderRadius={8}
      borderWidth="1px"
      borderColor="grey.950"
      backgroundColor="dark.50"
      backdropFilter="blur(6px)"
      boxShadow="lg"
    >
      <VStack alignItems="flex-start" gap={2}>
        <Avatar
          size="sm"
          name={asset.slug}
          src={asset.icon ?? BakoIcon}
          ignoreFallback
        />

        <VStack alignItems="flex-start" gap={0} maxW="full">
          <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
            {asset.name}
          </Text>
          <Text fontSize="xs" color="grey.250">
            {asset.slug}
          </Text>
        </VStack>

        <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
          {asset.amount}
        </Text>
      </VStack>
    </Card>
  );
};

const AssetsBalanceList = ({ assets }: AssetsBalanceProps) => {
  return (
    <Grid
      gap={4}
      templateColumns={{
        base: 'repeat(1, 1fr)',
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
        xl: 'repeat(5, 1fr)',
        '2xl': 'repeat(6, 1fr)',
      }}
    >
      {assets.map((asset) => (
        <AssetsBalanceCard key={asset.assetId} asset={asset} />
      ))}
    </Grid>
  );
};

export { AssetsBalanceList };
