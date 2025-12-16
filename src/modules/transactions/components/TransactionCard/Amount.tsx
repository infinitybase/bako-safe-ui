import { Flex, HStack, type StackProps, Text } from 'bako-ui';
import type { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { CustomSkeleton } from '@/components';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { TransactionBridgeResume } from '@/modules/core';
import { FIAT_CURRENCIES } from '@/modules/core/utils/fiat-currencies';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useGetAssetsByOperations } from '../../hooks';
import {
  ON_OFF_RAMP_TRANSACTION_TYPES,
  TransactionTypeBridge,
  type TransactionWithVault,
} from '../../services';
import { AssetsIcon } from './AssetsIcon';
import { AssetsIconWithNetwork } from './AssetsIconWithNetwork';
import { AmountUSD } from './transfer-details';

interface TransactionCardAmountProps extends StackProps {
  transaction: TransactionWithVault;
  showAmount: boolean;
}

const Amount = ({
  transaction,
  showAmount,
  ...rest
}: TransactionCardAmountProps) => {
  const { hasNoDefaultAssets } = useGetAssetsByOperations(
    transaction,
    transaction.predicate?.predicateAddress,
  );
  const {
    tokensUSD,
    screenSizes: { isMobile, isExtraSmall },
    assetsMap,
    nftList,
  } = useWorkspaceContext();
  const isOnOffRamp = useMemo(
    () => ON_OFF_RAMP_TRANSACTION_TYPES.includes(transaction.type),
    [transaction.type],
  );

  const isBridge = useMemo(
    () => transaction.type === TransactionTypeBridge.BRIDGE,
    [transaction.type],
  );

  const totalAmountSent = useMemo(
    () =>
      transaction.assets
        // remove fiat currencies from the total amount
        .filter((asset) => !FIAT_CURRENCIES.has(asset.assetId))
        .reduce((total, asset) => total.add(asset.amount), bn(0)),
    [transaction.assets],
  );

  const bridgeAssets = useMemo(() => {
    if (isBridge) {
      const bridge = transaction.resume?.bridge as TransactionBridgeResume;
      const fromAsset = {
        assetId: bridge.sourceToken.assetId,
        assetIcon: assetsMap[bridge.sourceToken.assetId]?.icon || '',
        networkIcon: bridge.sourceNetwork.logo,
      };
      const toAsset = {
        assetId: bridge.destinationToken.assetId,
        assetIcon: assetsMap[bridge.destinationToken.assetId]?.icon || '',
        networkIcon: bridge.destinationNetwork.logo,
      };
      return { from: fromAsset, to: toAsset };
    }
    return null;
  }, [assetsMap, isBridge, transaction.resume?.bridge]);

  const oneAssetOfEach = useMemo(() => {
    if (isBridge) {
      const assetsBridge = [] as ITransferAsset[];
      const bridge = transaction.resume?.bridge;

      if (bridge?.sourceToken)
        assetsBridge.push({
          ...bridge.sourceToken,
          amount: bridge.sourceToken.amount?.toString(),
        });

      if (bridge?.destinationToken)
        assetsBridge.push({
          ...bridge.destinationToken,
          amount: bridge.destinationToken.amount?.toString(),
        });

      return assetsBridge;
    }
    return transaction.assets.reduce((uniqueAssets, current) => {
      if (!uniqueAssets.find((asset) => asset.assetId === current.assetId)) {
        uniqueAssets.push(current);
      }

      return uniqueAssets;
    }, [] as ITransferAsset[]);
  }, [transaction.assets, transaction.resume?.bridge, isBridge]);

  const isMultiToken = useMemo(
    () => oneAssetOfEach.length >= 2 && !isOnOffRamp && !isBridge,
    [oneAssetOfEach.length, isOnOffRamp, isBridge],
  );

  const formattedAssets = useMemo(() => {
    const nftAssetIds = new Set(nftList.map((nft) => nft.assetId));

    return transaction?.assets.map((a) => ({
      ...a,
      amount: bn(a?.amount)?.format({
        units: assetsMap[a?.assetId]?.units ?? assetsMap.UNKNOWN.units,
      }),
      isNFT: a?.assetId ? nftAssetIds.has(a.assetId) : bn(a?.amount).eq(bn(1)),
    }));
  }, [transaction?.assets, nftList, assetsMap]);

  const txUSDAmount = useTxAmountToUSD(
    formattedAssets,
    tokensUSD?.isLoading,
    tokensUSD?.data,
    tokensUSD?.isUnknownToken,
  );

  const formattedAmount = useMemo(() => {
    const firstAsset = transaction.assets[0];
    const firstAssetOnMap = assetsMap[firstAsset?.assetId] || assetsMap.UNKNOWN;

    if (transaction?.assets.length === 1) {
      if (formattedAssets[0]?.isNFT) {
        return '1';
      }

      const amount = bn(firstAsset.amount).format({
        units: firstAssetOnMap.units,
      });
      const slug = firstAssetOnMap.slug;

      return `${amount} ${slug}`;
    }

    if (!firstAsset) return null;

    const allSameAsset = transaction.assets.every(
      (a) => a.assetId === firstAsset?.assetId,
    );

    if (allSameAsset) {
      return totalAmountSent.format({ units: firstAssetOnMap.units });
    }

    return null;
  }, [transaction.assets, formattedAssets, assetsMap, totalAmountSent]);

  const isNFT =
    formattedAssets.length === 1 && formattedAssets[0]?.isNFT === true;

  return (
    <HStack
      alignItems="center"
      justifyContent="flex-start"
      w={isExtraSmall ? 150 : 200}
      {...rest}
    >
      {!showAmount || hasNoDefaultAssets ? null : (
        <>
          {isBridge && bridgeAssets ? (
            <AssetsIconWithNetwork
              from={bridgeAssets?.from}
              to={bridgeAssets?.to}
            />
          ) : (
            <AssetsIcon assets={oneAssetOfEach} assetsMap={assetsMap} />
          )}
          <Flex
            flexDir={isMultiToken ? 'column-reverse' : 'column'}
            w={isMobile ? 'unset' : 'full'}
            mt={0.5}
            textAlign="start"
          >
            {isMultiToken ? (
              <Text color="gray.400" fontSize="xs" lineHeight="21.5px">
                Send multi tokens
              </Text>
            ) : (
              formattedAmount && (
                <Text color="textPrimary" fontSize="sm" lineHeight="21.5px">
                  {formattedAmount}
                </Text>
              )
            )}
            <Text
              as="div"
              fontSize={isMultiToken || !formattedAmount ? 'sm' : 'xs'}
              color="textSecondary"
              lineHeight="21.5px"
            >
              <CustomSkeleton loading={tokensUSD?.isLoading}>
                <AmountUSD amount={txUSDAmount} isNFT={isNFT} />
              </CustomSkeleton>
            </Text>
          </Flex>
        </>
      )}
    </HStack>
  );
};

export { Amount };
