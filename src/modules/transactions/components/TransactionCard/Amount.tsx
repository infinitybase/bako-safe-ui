import {
  AvatarGroup,
  type BoxProps,
  Flex,
  HStack,
  Image,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import type { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';

import { CustomSkeleton } from '@/components';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetAssetsByOperations } from '../../hooks';
import type { TransactionWithVault } from '../../services';
import { AmountUSD } from './transfer-details';
import type { Asset } from '@/modules/core/utils';

interface TransactionCardAmountProps extends BoxProps {
  transaction: TransactionWithVault;
  showAmount: boolean;
}

const Amount = ({
  transaction,
  showAmount,
  ...rest
}: TransactionCardAmountProps) => {
  const { operationAssets, hasNoDefaultAssets } = useGetAssetsByOperations(
    transaction,
    transaction.predicate?.predicateAddress,
  );

  const [showOnlyOneAsset] = useMediaQuery('(max-width: 400px)');
  const {
    tokensUSD,
    screenSizes: { isMobile, isExtraSmall },
    assetsMap,
  } = useWorkspaceContext();

  const totalAmoutSent = transaction.assets
    .reduce((total, asset) => total.add(asset.amount), bn(0))
    .format();

  const oneAssetOfEach = transaction.assets.reduce((uniqueAssets, current) => {
    if (!uniqueAssets.find((asset) => asset.assetId === current.assetId)) {
      uniqueAssets.push(current);
    }

    return uniqueAssets;
  }, [] as ITransferAsset[]);

  const isMultiToken = oneAssetOfEach.length >= 2;

  const txUSDAmount = useTxAmountToUSD(
    hasNoDefaultAssets
      ? [operationAssets]
      : transaction.assets.map((a) => {
          return {
            ...a,
            amount: bn(a?.amount).format({
              units: assetsMap[a?.assetId]?.units ?? assetsMap.UNKNOWN.units,
            }),
          };
        }),
    tokensUSD?.isLoading,
    tokensUSD?.data,
    tokensUSD?.isUnknownToken,
  );

  return (
    <HStack
      alignItems="center"
      justifyContent="flex-start"
      w={isExtraSmall ? 150 : 200}
      {...rest}
    >
      {!showAmount ? null : (
        <>
          <AvatarGroup
            max={showOnlyOneAsset ? 1 : 2}
            w={isMobile ? 'unset' : 56}
            justifyContent={isMobile ? 'start' : 'end'}
            position="relative"
          >
            {hasNoDefaultAssets && (
              <Image
                key={assetsMap[operationAssets.assetId]?.assetId}
                w={{ base: '34px', sm: 6 }}
                h={{ base: 'full', sm: 6 }}
                src={
                  assetsMap[operationAssets.assetId]?.icon ??
                  assetsMap.UNKNOWN.icon
                }
                borderRadius={100}
                alt="Asset Icon"
                objectFit="cover"
              />
            )}

            {oneAssetOfEach.map((asset) => {
              return (
                <Image
                  key={asset.assetId}
                  w={{ base: '30.5px', sm: 6 }}
                  h={{ base: 'full', sm: 6 }}
                  src={assetsMap[asset.assetId]?.icon ?? assetsMap.UNKNOWN.icon}
                  borderRadius={100}
                  alt="Asset Icon"
                  objectFit="cover"
                />
              );
            })}
          </AvatarGroup>
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
                {hasNoDefaultAssets
                  ? bn(operationAssets?.amount).format({
                      units:
                        assetsMap[operationAssets?.assetId]?.units ??
                        assetsMap.UNKNOWN.units,
                    })
                  : totalAmoutSent}
              </Text>
            )}
            <Text
              variant="description"
              fontSize={isMultiToken ? 'sm' : 'xs'}
              color={isMultiToken ? ' grey.75' : 'grey.425'}
            >
              <CustomSkeleton isLoaded={!tokensUSD?.isLoading}>
                <AmountUSD amount={txUSDAmount} />
              </CustomSkeleton>
            </Text>
          </Flex>
        </>
      )}
    </HStack>
  );
};

export { Amount };
