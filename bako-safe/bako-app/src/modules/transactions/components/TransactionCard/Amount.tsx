import {
  AvatarGroup,
  BoxProps,
  Flex,
  HStack,
  Image,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';

import { CustomSkeleton } from '@ui/components';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetAssetsByOperations } from '../../hooks';
import { TransactionWithVault } from '../../services';
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
    .reduce((total, asset) => total.add(bn.parseUnits(asset.amount)), bn(0))
    .format();

  const oneAssetOfEach = transaction.assets.reduce((uniqueAssets, current) => {
    if (!uniqueAssets.find((asset) => asset.assetId === current.assetId)) {
      uniqueAssets.push(current);
    }

    return uniqueAssets;
  }, [] as ITransferAsset[]);

  const isMultiToken = oneAssetOfEach.length >= 2;

  const txUSDAmount = useTxAmountToUSD(
    hasNoDefaultAssets ? [operationAssets] : transaction.assets,
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
            max={showOnlyOneAsset ? 1 : 3}
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
                  assetsMap['UNKNOWN'].icon
                }
                alt="Asset Icon"
                objectFit="cover"
              />
            )}

            {oneAssetOfEach.map((asset) => {
              return (
                <Image
                  key={asset.assetId}
                  w={{ base: isMultiToken ? '24px' : '30.5px', sm: 6 }}
                  h={{ base: 'full', sm: 6 }}
                  src={
                    assetsMap[asset.assetId]?.icon ?? assetsMap['UNKNOWN'].icon
                  }
                  alt="Asset Icon"
                  objectFit="cover"
                />
              );
            })}
          </AvatarGroup>
          <Flex
            flexDir={isMultiToken ? 'column-reverse' : 'column'}
            w="full"
            mt={0.5}
            textAlign="start"
          >
            {isMultiToken ? (
              <Text color="grey.425" fontSize="xs">
                Multi-token
              </Text>
            ) : (
              <Text color="grey.75" fontSize="sm">
                {hasNoDefaultAssets ? operationAssets.amount : totalAmoutSent}
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
