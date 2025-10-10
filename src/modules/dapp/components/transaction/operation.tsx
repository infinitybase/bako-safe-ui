import { Box, HStack, VStack } from '@chakra-ui/react';
import { Operation } from 'fuels';

import { CustomSkeleton } from '@/components';
import { useAssetMap } from '@/modules/assets-tokens/hooks/useAssetMap';
import { Asset } from '@/modules/core';
import { DappTransactionAsset } from '@/modules/dapp/components/transaction/asset';
import { DappTransactionFromTo } from '@/modules/dapp/components/transaction/from-to';
import { RecipientCard } from '@/modules/dapp/components/transaction/recipient';
import { useNetworks } from '@/modules/network/hooks';
import { formatAmount, getAssetImageUrl } from '@/utils';

interface OperationProps {
  vault?: {
    name: string;
    predicateAddress: string;
  };
  operation?: Operation;
}

export const DappTransactionOperationSekeleton = () => (
  <VStack w="full">
    <HStack gap={0} w="full">
      <RecipientCard justifyContent="space-between">
        {/*<CustomSkeleton w="full" h={5} borderRadius={2} />*/}
        <CustomSkeleton w="full" h="100px" borderRadius={2} />
        <CustomSkeleton w="full" h={8} borderRadius={2} />
      </RecipientCard>
      <RecipientCard justifyContent="space-between">
        <CustomSkeleton w="full" h="100px" borderRadius={2} />
        <CustomSkeleton w="full" h={8} borderRadius={2} />
      </RecipientCard>
    </HStack>
    <RecipientCard display="flex" flexDirection="row" gap={3} minH="95px">
      <CustomSkeleton w={200} h="70px" borderRadius={2} />
      <CustomSkeleton w="full" h="70px" borderRadius={2} />
    </RecipientCard>
  </VStack>
);

const DappTransactionOperation = ({ vault, operation }: OperationProps) => {
  const { to, assetsSent, from } = operation ?? {};
  const { currentNetwork } = useNetworks();
  const { getAssetInfo, assetsMap } = useAssetMap(currentNetwork.chainId);

  if (!to || !from || !vault) return null;

  const assetData = assetsSent?.map((sent) => {
    const assetInfo = getAssetInfo(sent.assetId);

    return {
      ...assetInfo,
      amount: sent.amount,
    };
  });

  const assets = assetData?.map((data) => {
    const assetAmount = formatAmount({
      amount: data.amount,
      options: { units: data.units },
    });

    return {
      icon: data?.icon,
      amount: assetAmount,
      assetId: data?.assetId,
      name: data?.name || data?.metadata?.name || '',
      slug: data?.slug ?? (assetAmount === '1' ? 'NFT' : ''),
      image: getAssetImageUrl(data as Asset, assetsMap),
    };
  });

  const hasAssets = !!assets?.length;

  return (
    <Box w="full" mb={7}>
      <DappTransactionFromTo
        from={{
          address: from.address,
          type: from.type,
        }}
        to={{
          address: to.address,
          type: to.type,
        }}
        vault={vault}
        hasAssets={hasAssets}
      />
      {assets && <DappTransactionAsset assets={assets} />}
    </Box>
  );
};

export { DappTransactionOperation };
