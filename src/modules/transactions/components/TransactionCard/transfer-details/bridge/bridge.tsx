import { Box } from 'bako-ui';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { useVerifyTransactionInformations } from '@/modules/transactions/hooks';
import { TransactionWithVault } from '@/modules/transactions/services';
import { formatMaxDecimals } from '@/utils';

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

  const sourceTokenAmount = useMemo(() => {
    if (sourceTokenDecimals === undefined) return null;

    const amount = bridgeInfo?.sourceToken?.amount?.toString() ?? '';
    const formattedAmount = formatMaxDecimals(amount, sourceTokenDecimals);

    return bn.parseUnits(formattedAmount, sourceTokenDecimals).toHex();
  }, [bridgeInfo?.sourceToken?.amount, sourceTokenDecimals]);

  const destinationTokenAmount = useMemo(() => {
    if (destinationTokenDecimals === undefined) return null;

    const amount = bridgeInfo?.destinationToken?.amount?.toString() ?? '';
    const formattedAmount = formatMaxDecimals(amount, destinationTokenDecimals);

    return bn.parseUnits(formattedAmount, destinationTokenDecimals).toHex();
  }, [bridgeInfo?.destinationToken?.amount, destinationTokenDecimals]);

  if (!bridgeInfo || !sourceTokenAmount || !destinationTokenAmount) return null;

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
          amount: sourceTokenAmount,
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
          amount: destinationTokenAmount,
          to: bridgeInfo?.destinationToken?.to ?? '',
          transactionID: transaction.id,
        }}
        bridgeImgNet={bridgeInfo?.destinationNetwork?.logo}
      />
    </Box>
  );
};

export default BridgeCardDetail;
