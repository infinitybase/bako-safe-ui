import { Card, Grid, Image, Text, VStack } from '@chakra-ui/react';

import { Asset } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetTokenInfos } from '../../hooks';

interface AssetsBalanceProps {
  assets: Asset[];
}

interface AssetsBalanceCardProps {
  asset: Asset;
}

const AssetsBalanceCard = ({ asset }: AssetsBalanceCardProps) => {
  const { assetsMap } = useWorkspaceContext();
  const { assetAmount, assetsInfo } = useGetTokenInfos({
    ...asset,
    assetsMap,
  });

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
        <Image
          w={{ base: 8, sm: 10 }}
          h={{ base: 8, sm: 10 }}
          src={assetsInfo?.icon ?? ''}
          alt="Asset Icon"
          objectFit="cover"
        />
        <VStack alignItems="flex-start" gap={0} maxW="full">
          <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
            {assetsInfo.name}
          </Text>
          <Text fontSize="xs" color="grey.250">
            {assetsInfo.slug}
          </Text>
        </VStack>
        <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
          {assetAmount}
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
