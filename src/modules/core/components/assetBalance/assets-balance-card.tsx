import { Image, Text, VStack } from 'bako-ui';

import { Card } from '@/components';
import { Asset } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

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
      p={6}
      borderRadius="2xl"
      border="none"
      backgroundColor="bg.panel"
      transition="background-color 0.3s ease"
      _hover={{
        bg: 'bg.muted',
      }}
    >
      <VStack alignItems="flex-start" gap={4} h="full">
        <Image
          w={7}
          h={7}
          src={assetsInfo?.icon}
          borderRadius="full"
          alt="Asset Icon"
          objectFit="cover"
        />
        <VStack
          gap={4}
          w="full"
          flex={1}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <VStack
            gap={0}
            w="full"
            minH="2.25rem"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Text fontSize="xs" color="textSecondary" maxW="full" truncate>
              {assetsInfo?.name}
            </Text>

            <Text fontSize="xs" color="textSecondary">
              {transactionAmount > 0 ? formattedAmount : ''}
            </Text>
          </VStack>

          <Text fontSize="sm" color="gray.50" maxW="full" truncate>
            {assetAmount}{' '}
            <Text as="span" color="gray.50" fontSize="sm">
              {assetsInfo?.slug?.toUpperCase() ?? ''}
            </Text>
          </Text>
        </VStack>
      </VStack>
    </Card>
  );
};

export { AssetsBalanceCard };
