import { Box } from '@chakra-ui/react';
import { Operation } from '@fuel-ts/providers';
import { Vault } from 'bsafe';
import { bn } from 'fuels';

import { assetsMap } from '@/modules';
import { DappTransactionAsset } from '@/modules/dapp/components/transaction/asset';
import { DappTransactionFromTo } from '@/modules/dapp/components/transaction/from-to';

interface OperationProps {
  operation?: Operation;
  vault?: Pick<Vault['BSAFEVault'], 'name' | 'predicateAddress'>;
  isLoading?: boolean;
}

const DappTransactionOperation = ({
  vault,
  operation,
  isLoading,
}: OperationProps) => {
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

  if (!to || !from || !vault || isLoading) {
    return null;
  }

  return (
    <Box w="full" mb={7}>
      <DappTransactionFromTo to={from} from={to} vault={vault} />
      {assets && <DappTransactionAsset assets={assets} />}
    </Box>
  );
};

export { DappTransactionOperation };
