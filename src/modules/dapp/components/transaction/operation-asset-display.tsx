import { Box, Flex, Text } from 'bako-ui';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { useWorkspaceContext } from '@/modules';
import { AddressUtils } from '@/modules/core';

import { SimplifiedAsset } from '../../services/simplify-transaction';

const MIN_DISPLAY_AMOUNT = '0.000000001';

function formatUsdEstimate(
  amount: string | undefined,
  assetId: string | undefined,
  tokensUSD: Record<string, { usdAmount: number }> | undefined,
): string {
  if (!amount || !assetId) return '$0.00';
  const price = tokensUSD?.[assetId]?.usdAmount ?? 0;
  const estimated = parseFloat(amount) * price;
  return estimated.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });
}

function formatAssetLabel(
  assetAmount: string,
  assetSlug: string | undefined,
  assetId: string,
): string {
  if (assetAmount === MIN_DISPLAY_AMOUNT) return '';
  if (!assetSlug || assetSlug === 'UNK') {
    return `${assetAmount} NFT ${AddressUtils.format(assetId, 8)}`;
  }
  return `${assetAmount} ${assetSlug}`;
}

function useAssetInfo(asset?: SimplifiedAsset) {
  const { tokensUSD, assetsMap } = useWorkspaceContext();

  const assetData = useMemo(() => {
    if (!asset) return assetsMap?.['UNKNOWN'];
    return assetsMap?.[asset.assetId] ?? assetsMap?.['UNKNOWN'];
  }, [asset, assetsMap]);

  const amountBn = useMemo(() => bn(asset?.amount || 0), [asset]);

  const formattedAmount = amountBn.format({ units: assetData?.units });

  const formattedUsd = asset
    ? formatUsdEstimate(
        bn(asset.amount).formatUnits(),
        asset.assetId,
        tokensUSD.data,
      )
    : '$0.00';

  const label = formatAssetLabel(
    formattedAmount,
    assetData?.slug,
    asset?.assetId ?? 'UNKNOWN',
  );

  return { assetData, formattedUsd, label };
}

interface AssetDisplayProps {
  assets?: SimplifiedAsset[];
}

export const OperationAssetDisplay = ({ assets }: AssetDisplayProps) => {
  const mainAsset = assets?.[0];
  const { assetData, formattedUsd, label } = useAssetInfo(mainAsset);

  if (!mainAsset) return null;

  return (
    <Flex
      w="full"
      alignItems="center"
      bg="gray.700"
      borderRadius={8}
      p={4}
      gap={3}
      align="center"
    >
      <Box w={9} h={4}>
        {assetData?.icon && (
          <img
            src={assetData.icon}
            alt="Asset icon"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </Box>

      <Flex gap={1} align="center">
        <Text fontWeight={500} color="gray.100" fontSize="xs" lineHeight="12px">
          {label}
        </Text>

        {formattedUsd !== '$0.00' && (
          <Text
            fontWeight={400}
            color="gray.400"
            fontSize="xs"
            lineHeight="12px"
          >
            ~ {formattedUsd}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
