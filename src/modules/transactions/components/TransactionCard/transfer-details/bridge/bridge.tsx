import { Box } from 'bako-ui';
import { parseUnits } from 'ethers';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { useVerifyTransactionInformations } from '@/modules/transactions/hooks';
import { TransactionWithVault } from '@/modules/transactions/services';

import { AssetBoxInfo } from '../../AssetBoxInfo';

interface BridgeCardDetailProps {
  transaction: TransactionWithVault;
}

const BridgeCardDetail = ({ transaction }: BridgeCardDetailProps) => {
  const { isDeploy, isDeposit } = useVerifyTransactionInformations(transaction);

  const bridgeInfo = transaction.resume?.bridge;

  const sourceTokenDecimals = useMemo(
    () => bridgeInfo?.sourceToken?.decimals,
    [bridgeInfo?.sourceToken?.decimals],
  );

  const destinationTokenDecimals = useMemo(
    () => bridgeInfo?.destinationToken?.decimals,
    [bridgeInfo?.destinationToken?.decimals],
  );

  const sourceTokenAmount = useMemo(
    () => bridgeInfo?.sourceToken?.amount?.toString(),
    [bridgeInfo?.sourceToken?.amount],
  );

  const destinationTokenAmount = useMemo(
    () => bridgeInfo?.destinationToken?.amount?.toString(),
    [bridgeInfo?.destinationToken?.amount],
  );

  if (
    !bridgeInfo ||
    !sourceTokenDecimals ||
    !destinationTokenDecimals ||
    !sourceTokenAmount ||
    !destinationTokenAmount
  )
    return null;

  return (
    <Box
      alignItems="flex-start"
      flexWrap="wrap"
      w={{ base: 'full', sm: 'unset' }}
    >
      <AssetBoxInfo
        isContract={false}
        isDeploy={isDeploy}
        isDeposit={isDeposit}
        asset={{
          assetId: bridgeInfo?.sourceToken?.assetId ?? '',
          amount: `${bn(parseUnits(sourceTokenAmount ?? '', sourceTokenDecimals)?.toString())}`,
          to: bridgeInfo?.sourceToken?.to ?? '',
          transactionID: transaction.id,
        }}
        bridgeImgNet={'https://verified-assets.fuel.network/images/fuel.svg'}
      />

      <AssetBoxInfo
        isContract={false}
        isDeploy={isDeploy}
        isDeposit={isDeposit}
        asset={{
          assetId: bridgeInfo?.destinationToken?.assetId ?? '',
          amount: `${bn(parseUnits(destinationTokenAmount ?? '', destinationTokenDecimals)?.toString())}`,
          to: bridgeInfo?.destinationToken?.to ?? '',
          transactionID: transaction.id,
        }}
        bridgeImgNet={bridgeInfo?.destinationNetwork?.logo}
      />
    </Box>
  );
};

export default BridgeCardDetail;
