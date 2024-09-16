import { Box, HStack, VStack } from '@chakra-ui/react';
import { Vault } from 'bakosafe';
import { bn, Operation } from 'fuels';

import { CustomSkeleton } from '@/components';
import { assetsMap } from '@/modules/core/utils';
import { DappTransactionAsset } from '@/modules/dapp/components/transaction/asset';
import { DappTransactionFromTo } from '@/modules/dapp/components/transaction/from-to';
import { RecipientCard } from '@/modules/dapp/components/transaction/recipient';

import { IFuelTransactionNames } from '../../services';

interface OperationProps {
  vault?: Pick<Vault['BakoSafeVault'], 'name' | 'predicateAddress'>;
  operation?: Operation;
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
  const { to, assetsSent, from, name } = operation ?? {};

  const isContract =
    (name as unknown as IFuelTransactionNames) ===
    IFuelTransactionNames.CONTRACT_CALL;

  if (!to || !from || !vault) return null;

  const assetData = isContract
    ? null
    : assetsSent?.map((sent) => {
        return assetsMap[sent.assetId] && assetsMap[sent.assetId]
          ? { ...assetsMap[sent.assetId], amount: sent.amount }
          : {
              ...assetsMap['UNKNOWN'],
              amount: sent.amount,
            };
      });

  const assets = isContract
    ? null
    : assetData?.map((data) => {
        return {
          icon: data?.icon,
          amount: bn(data?.amount ?? '').format(),
          assetId: data?.assetId,
          name: data?.name,
          slug: data?.slug,
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
