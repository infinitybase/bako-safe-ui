import {
  Box,
  ComponentWithAs,
  HStack,
  IconProps,
  VStack,
} from '@chakra-ui/react';
import { AddressType } from '@fuel-ts/providers';
import { Vault } from 'bakosafe';
import { bn, Operation, OperationTransactionAddress } from 'fuels';

import { CustomSkeleton } from '@/components';
import { assetsMap } from '@/modules/core/utils';
import { DappTransactionAsset } from '@/modules/dapp/components/transaction/asset';
import { DappTransactionFromTo } from '@/modules/dapp/components/transaction/from-to';
import { RecipientCard } from '@/modules/dapp/components/transaction/recipient';

interface OperationProps {
  vault?: Pick<Vault['BakoSafeVault'], 'name' | 'predicateAddress'>;
  operation?: Operation;
  incrementContractCallAsset: {
    to: OperationTransactionAddress | undefined;
    from: OperationTransactionAddress | undefined;
    amount: string;
    assetId: string;
    name: string;
    icon: ComponentWithAs<'svg', IconProps>;
  } | null;
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

const DappTransactionOperation = ({
  vault,
  operation,
  incrementContractCallAsset,
}: OperationProps) => {
  const { to, assetsSent } = operation ?? {};

  if (!to || (!assetsSent && !incrementContractCallAsset) || !vault)
    return null;

  const assetData =
    assetsSent && !assetsMap[assetsSent[0].assetId]
      ? assetsMap['UNKNOWN']
      : assetsSent && assetsMap[assetsSent[0].assetId]
        ? assetsMap[assetsSent[0].assetId]
        : incrementContractCallAsset && !assetsSent
          ? assetsMap[incrementContractCallAsset.assetId]
          : assetsMap['UNKNOWN'];

  const assets = [
    {
      icon: assetData?.icon,
      amount: bn(
        assetsSent
          ? assetsSent[0].amount
          : incrementContractCallAsset
            ? incrementContractCallAsset?.amount
            : '',
      ).format(),
      assetId: assetsSent
        ? assetsSent[0].assetId
        : (incrementContractCallAsset?.assetId ?? ''),
      name: assetData?.name,
      slug: assetData?.slug,
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
