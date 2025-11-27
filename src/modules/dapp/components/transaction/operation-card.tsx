import { Box, Flex, Text, useClipboard, VStack } from 'bako-ui';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { useWorkspaceContext } from '@/modules';
import { AddressUtils } from '@/modules/core';

import { UseTransactionSocket } from '../../hooks';
import {
  SimplifiedAsset,
  SimplifiedOperation,
  TxCategory,
} from '../../services/simplify-transaction';
import { DappCommon } from '../common';

interface AssetDisplayProps {
  assets?: SimplifiedAsset[];
}

const AssetDisplay = ({ assets }: AssetDisplayProps) => {
  const { tokensUSD, assetsMap } = useWorkspaceContext();

  const asset = Object.values(assetsMap).find(
    (a) => a.assetId === assets?.[0]?.assetId,
  );

  const formatUsdEstimate = (amount: string, assetId: string) => {
    if (!amount || !assetId) return '$0.00';
    const price = tokensUSD.data?.[assetId]?.usdAmount ?? 0;
    const estimated = parseFloat(amount) * price;
    return estimated.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    });
  };

  const assetOperation = useMemo(() => bn(assets?.[0]?.amount || 0), [assets]);

  const assetsInfo = asset
    ? (assetsMap?.[asset.assetId] ?? assetsMap?.['UNKNOWN'])
    : assetsMap?.['UNKNOWN'];

  const assetAmount = assetOperation.format({
    units: assetsInfo?.units,
  });

  const formatted = assets?.[0]
    ? formatUsdEstimate(bn(assets[0].amount).formatUnits(), assets[0].assetId)
    : '$0.00';

  const assetId = assets?.[0]?.assetId || 'UNKNOWN';

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
        {assetsInfo?.icon && (
          <img
            src={assetsInfo.icon}
            alt="Asset icon"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </Box>
      <Flex gap={1}>
        <Text fontWeight={500} color="gray.100" fontSize="xs" lineHeight="12px">
          {assetAmount === '0.000000001' ? '' : assetAmount}{' '}
          {assetsInfo?.slug === 'UNK' || !assetsInfo?.slug
            ? `NFT ${AddressUtils.format(assetId, 8)}`
            : assetsInfo.slug}
        </Text>
        {formatted !== '$0.00' && (
          <Text
            fontWeight={400}
            color="gray.400"
            fontSize="xs"
            lineHeight="12px"
          >
            {`~ ${formatted}`}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

interface DappTransactionOperationCardProps {
  operation: SimplifiedOperation;
  vault?: UseTransactionSocket['vault'];
}

export const DappTransactionOperationCard = (
  props: DappTransactionOperationCardProps,
) => {
  const { operation, vault } = props;

  const { copy, copied } = useClipboard({ value: vault?.address || '' });

  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const hasAssetsComingBack = useMemo(
    () => operation.assetsToFrom?.some((a) => a.amount.gt(0)),
    [operation.assetsToFrom],
  );

  return (
    <VStack gap={1} w="full">
      <DappCommon.VaultCard
        address={operation.from.address}
        name={
          operation.isFromCurrentAccount ? vault?.name || 'Vault' : undefined
        }
        isCurrentAccount={operation.isFromCurrentAccount ?? false}
        vaultAddress={vault?.address}
        onCopy={copy}
        hasCopied={copied}
      />

      {!isContract && <AssetDisplay assets={operation.assets} />}

      <DappCommon.OperationArrow
        label={isContract ? 'Calling contract' : 'Sending funds'}
      />

      <DappCommon.VaultCard
        address={operation.to.address}
        name={operation.isToCurrentAccount ? vault?.name || 'Vault' : undefined}
        isCurrentAccount={operation.isToCurrentAccount ?? false}
        vaultAddress={vault?.address}
        onCopy={copy}
        hasCopied={copied}
      />

      {hasAssetsComingBack && (
        <>
          <AssetDisplay assets={operation.assetsToFrom} />

          <DappCommon.OperationArrow label="Sends funds" />

          <DappCommon.VaultCard
            address={operation.from.address}
            name={
              operation.isFromCurrentAccount
                ? vault?.name || 'Vault'
                : undefined
            }
            isCurrentAccount={operation.isFromCurrentAccount ?? false}
            vaultAddress={vault?.address}
            onCopy={copy}
            hasCopied={copied}
          />
        </>
      )}
    </VStack>
  );
};
