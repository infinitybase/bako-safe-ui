import { Stack, Text } from 'bako-ui';
import { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';
import { memo, useMemo } from 'react';

import { useWorkspaceContext } from '@/modules';
import { FIAT_CURRENCIES } from '@/modules/core/utils/fiat-currencies';
import { isHex } from '@/utils';

interface AmountProps {
  assets: ITransferAsset[];
}

export const Amount = memo(({ assets }: AmountProps) => {
  const { assetsMap, tokensUSD } = useWorkspaceContext();
  const assetsWithUSD = useMemo(
    () =>
      assets
        // remove fiat currencies from the total amount
        .filter((asset) => !FIAT_CURRENCIES.has(asset.assetId))
        .map((asset) => ({
          ...asset,
          usd:
            (tokensUSD.data[asset.assetId]?.usdAmount ?? 0) *
            Number(
              bn(asset.amount).format({
                units:
                  assetsMap[asset.assetId]?.units ?? assetsMap.UNKNOWN.units,
              }),
            ),
        })),
    [assets, assetsMap, tokensUSD],
  );

  const isOnlyOneAsset = useMemo(
    () => assetsWithUSD.length === 1,
    [assetsWithUSD],
  );

  const formattedUSDAmount = useMemo(() => {
    if (isOnlyOneAsset) {
      const asset = assetsMap[assetsWithUSD[0].assetId] || assetsMap.UNKNOWN;
      const isNFT = asset.isNFT || asset.units === 0;
      if (isNFT) return '1';
      const value = assetsWithUSD[0].usd;
      return value > 0
        ? Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
          }).format(value)
        : null;
    }

    const totalAmountSent = assetsWithUSD.reduce(
      (acc, curr) => acc + curr.usd,
      0,
    );

    return totalAmountSent > 0
      ? Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(totalAmountSent)
      : null;
  }, [assetsMap, assetsWithUSD, isOnlyOneAsset]);

  const amount = useMemo(() => {
    if (isOnlyOneAsset) {
      const asset = assetsMap[assetsWithUSD[0].assetId] || assetsMap.UNKNOWN;
      const isNFT = asset.isNFT || asset.units === 0;
      if (isNFT) return null;

      return isHex(assetsWithUSD[0].amount)
        ? bn(assetsWithUSD[0].amount).format({ units: asset.units })
        : assetsWithUSD[0].amount;
    }

    return null;
  }, [assetsMap, assetsWithUSD, isOnlyOneAsset]);

  return (
    <Stack gap={0} alignItems="flex-end">
      {amount && (
        <Text
          color="textPrimary"
          fontSize="md"
          fontWeight="semibold"
          letterSpacing="wider"
          lineHeight="shorter"
          mb={1}
        >
          {amount}
        </Text>
      )}
      <Text
        color={amount ? 'gray.400' : 'textPrimary'}
        fontSize={amount ? 'xs' : 'md'}
        fontWeight="semibold"
        letterSpacing={amount ? 'normal' : 'wider'}
        lineHeight="shorter"
      >
        {formattedUSDAmount}
      </Text>
    </Stack>
  );
});

Amount.displayName = 'TransactionCardAmount';
