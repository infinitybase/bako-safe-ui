import {
  type BoxProps,
  Flex,
  HStack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import type { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { CustomSkeleton } from '@/components';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetAssetsByOperations } from '../../hooks';
import type { TransactionWithVault } from '../../services';
import { AssetsIcon } from './AssetsIcon';
import { AmountUSD } from './transfer-details';

interface TransactionCardAmountProps extends BoxProps {
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
  const [showOnlyOneAsset] = useMediaQuery('(max-width: 400px)');
  const {
    tokensUSD,
    screenSizes: { isMobile, isExtraSmall },
    assetsMap,
    nftList,
  } = useWorkspaceContext();

  const totalAmoutSent = useMemo(
    () =>
      transaction.assets
        .reduce((total, asset) => total.add(asset.amount), bn(0))
        .format(),
    [transaction.assets],
  );

  const oneAssetOfEach = useMemo(
    () =>
      transaction.assets.reduce((uniqueAssets, current) => {
        if (!uniqueAssets.find((asset) => asset.assetId === current.assetId)) {
          uniqueAssets.push(current);
        }

        return uniqueAssets;
      }, [] as ITransferAsset[]),
    [transaction.assets],
  );

  const isMultiToken = useMemo(
    () => oneAssetOfEach.length >= 2,
    [oneAssetOfEach.length],
  );

  const formattedAssets = useMemo(() => {
    const nftAssetIds = new Set(nftList.map((nft) => nft.assetId));

    return transaction?.assets.map((a) => {
      return {
        ...a,
        amount: bn(a?.amount)?.format({
          units: assetsMap[a?.assetId]?.units ?? assetsMap.UNKNOWN.units,
        }),
        isNFT: a?.assetId
          ? nftAssetIds.has(a.assetId)
          : bn(a?.amount).eq(bn(1)),
      };
    });
  }, [transaction?.assets, nftList, assetsMap]);

  const txUSDAmount = useTxAmountToUSD(
    formattedAssets,
    tokensUSD?.isLoading,
    tokensUSD?.data,
    tokensUSD?.isUnknownToken,
  );

  const formattedAmount = useMemo(
    () =>
      transaction?.assets.length === 1
        ? bn(transaction.assets[0].amount).format({
            units: assetsMap[transaction.assets[0].assetId]?.units ?? 9,
          })
        : totalAmoutSent,
    [transaction?.assets, assetsMap, totalAmoutSent],
  );
  const isNFT = formattedAssets[0].isNFT === true;

  return (
    <HStack
      alignItems="center"
      justifyContent="flex-start"
      w={isExtraSmall ? 150 : 200}
      {...rest}
    >
      {!showAmount || hasNoDefaultAssets ? null : (
        <>
          <AssetsIcon
            assets={oneAssetOfEach}
            isMobile={isMobile}
            showOnlyOneAsset={showOnlyOneAsset}
            assetsMap={assetsMap}
            isNFT={isNFT}
          />
          <Flex
            flexDir={isMultiToken ? 'column-reverse' : 'column'}
            w={isMobile ? 'unset' : 'full'}
            mt={0.5}
            textAlign="start"
          >
            {isMultiToken ? (
              <Text color="grey.425" fontSize="xs">
                Multi-token
              </Text>
            ) : (
              <Text color="grey.75" fontSize="sm">
                {isNFT ? '1' : formattedAmount}
              </Text>
            )}
            <Text
              variant="description"
              fontSize={isMultiToken ? 'sm' : 'xs'}
              color={isMultiToken ? ' grey.75' : 'grey.425'}
            >
              <CustomSkeleton isLoaded={!tokensUSD?.isLoading}>
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
