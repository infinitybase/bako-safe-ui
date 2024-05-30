import { Box, HStack, VStack } from '@chakra-ui/react';
import { AddressType } from '@fuel-ts/providers';
import { Vault } from 'bakosafe';

import { CustomSkeleton } from '@/components';
import { assetsMap } from '@/modules/core/utils';
import { DappTransactionAsset } from '@/modules/dapp/components/transaction/asset';
import { DappTransactionFromTo } from '@/modules/dapp/components/transaction/from-to';
import { RecipientCard } from '@/modules/dapp/components/transaction/recipient';

import { IOutput } from '../../services/fuel-transaction';

interface OperationProps {
  vault?: Pick<Vault['BakoSafeVault'], 'name' | 'predicateAddress'>;
  operation?: IOutput;
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
  const { to, assetId, amount } = operation ?? {};

  if (!to || !assetId || !amount || !vault) return null;

  const assetData = assetsMap[assetId];

  const assets = [
    {
      icon: assetData.icon,
      amount,
      assetId,
      name: assetData.name,
      slug: assetData.slug,
    },
  ];
  const hasAssets = !!assets?.length;

  return (
    <Box w="full" mb={7}>
      <DappTransactionFromTo
        to={to}
        from={{
          address: vault.predicateAddress,
          type: AddressType.contract,
        }}
        vault={vault}
        hasAssets={hasAssets}
      />
      {assets && <DappTransactionAsset assets={assets} />}
    </Box>
  );
};

export { DappTransactionOperation };
