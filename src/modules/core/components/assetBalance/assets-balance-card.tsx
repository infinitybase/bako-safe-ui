import { Image, Text, VStack } from 'bako-ui';

import { Card } from '@/components';
import { Asset } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetTokenInfos } from '../../hooks';

const AssetsBalanceCard = ({
  asset,
  usdAmount,
}: {
  asset: Asset;
  usdAmount: number;
}) => {
  const { assetsMap } = useWorkspaceContext();
  const { assetAmount, assetsInfo } = useGetTokenInfos({ ...asset, assetsMap });

  const transactionAmount =
    Number(assetAmount.replace(/,/g, '')) * (usdAmount ?? 0);

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(transactionAmount);

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
      <VStack alignItems="flex-start" gap={4}>
        <Image
          w={{ base: 8, sm: 10 }}
          h={{ base: 8, sm: 10 }}
          src={assetsInfo?.icon}
          borderRadius={100}
          alt="Asset Icon"
          objectFit="cover"
        />
        <VStack alignItems="flex-start" gap={0} w="full">
          <Text fontSize="sm" color="grey.50" maxW="full" truncate>
            {assetsInfo?.name}
          </Text>
          <Text fontSize="sm" color="grey.50" maxW="full" truncate>
            {assetAmount}{' '}
            <Text as="span" color="grey.400" fontSize="xs">
              {assetsInfo?.slug?.toUpperCase() ?? ''}
            </Text>
          </Text>
          <Text fontSize="xs" color="grey.400" minH="1em">
            {transactionAmount > 0 ? formattedAmount : ''}
          </Text>
        </VStack>
      </VStack>
    </Card>
  );
};

export { AssetsBalanceCard };
