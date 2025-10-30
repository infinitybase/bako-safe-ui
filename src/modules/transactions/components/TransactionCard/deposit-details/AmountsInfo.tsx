import { Text, VStack } from 'bako-ui';
import { bn } from 'fuels';
import { memo, useMemo } from 'react';

import type { AssetModel } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { isHex } from '@/utils';

import { AmountUSD } from '../transfer-details';

interface AmountsInfoProps {
  asset: AssetModel;
  txUSDAmount: string;
  isNFT: boolean;
}

const AmountsInfo = memo(({ asset, txUSDAmount, isNFT }: AmountsInfoProps) => {
  const {
    screenSizes: { isMobile },
    assetsMap,
  } = useWorkspaceContext();

  const assetMetadata = useMemo(
    () =>
      asset?.assetId && assetsMap?.[asset?.assetId]
        ? assetsMap[asset?.assetId]
        : assetsMap?.['UNKNOWN'],
    [asset?.assetId, assetsMap],
  );

  const assetAmount = useMemo(() => {
    if (isNFT) return '1';

    return isHex(asset.amount)
      ? bn(asset?.amount)?.format({
          units: assetMetadata.units,
        })
      : asset.amount;
  }, [asset, assetMetadata, isNFT]);

  const showAmountUSD = useMemo(() => {
    return !!txUSDAmount && txUSDAmount !== '0.00' && !isNFT;
  }, [isNFT, txUSDAmount]);

  return (
    <VStack w={{ base: '105px', sm: 'fit-content' }}>
      <Text
        textAlign={isMobile ? 'end' : 'center'}
        color="textPrimary"
        fontSize="xs"
      >
        {assetAmount} {assetMetadata.slug}
      </Text>
      {showAmountUSD && (
        <Text
          textAlign={isMobile ? 'end' : 'center'}
          fontSize="xs"
          mt={1}
          color="gray.400"
        >
          <AmountUSD amount={txUSDAmount} isNFT={isNFT} />
        </Text>
      )}
    </VStack>
  );
});

AmountsInfo.displayName = 'AmountsInfo';

export default AmountsInfo;
