import { Box, HStack, VStack } from '@chakra-ui/react';
import { Operation } from '@fuel-ts/providers';
import { Vault } from 'bsafe';
import { bn } from 'fuels';

import { CustomSkeleton } from '@/components';
import { assetsMap } from '@/modules/core/utils';
import { DappTransactionAsset } from '@/modules/dapp/components/transaction/asset';
import { DappTransactionFromTo } from '@/modules/dapp/components/transaction/from-to';
import { RecipientCard } from '@/modules/dapp/components/transaction/recipient';

interface OperationProps {
  operation?: Operation;
  vault?: Pick<Vault['BSAFEVault'], 'name' | 'predicateAddress'>;
}

export const DappTransactionOperationSekeleton = () => (
  <VStack w="full">
    <HStack spacing={0} w="full">
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
  const { to, from, assetsSent } = operation ?? {};
  const assets = assetsSent?.map((asset) => {
    const assetData = assetsMap[asset.assetId];

    return {
      icon: assetData.icon,
      amount: bn(asset.amount).format(),
      assetId: asset.assetId,
      name: assetData.name,
      slug: assetData.slug,
    };
  });
  const hasAssets = !!assets?.length;

  if (!to || !from || !vault) {
    /* TODO: should display skeleton here */
    return null;
  }

  return (
    <Box w="full" mb={7}>
      <DappTransactionFromTo
        to={to}
        from={from}
        vault={vault}
        hasAssets={hasAssets}
      />
      {assets && <DappTransactionAsset assets={assets} />}
    </Box>
  );
};

export { DappTransactionOperation };
