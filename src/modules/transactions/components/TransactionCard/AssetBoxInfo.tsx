import { Icon } from '@chakra-ui/icons';
import {
  Center,
  HStack,
  Image,
  type StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

import { Address, DoubleArrowIcon, Handle } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import type { AssetModel } from '@/modules/core';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { parseURI } from '@/modules/core/utils/formatter';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AmountUSD } from './transfer-details';
import { AddressActions } from './transfer-details/address-actions';

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  isDeposit?: boolean;
  isDeploy?: boolean;
  isContract?: boolean;
  handle?: string;
  resolver?: string;
}

const AssetBoxInfo = ({
  asset,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isDeposit,
  isDeploy,
  isContract,
  handle,
  resolver,
  ...props
}: AssetBoxInfoProps) => {
  const {
    tokensUSD,
    screenSizes: {
      isMobile,
      isLowerThanFourHundredAndThirty,
      isExtraSmall,
      isLitteSmall,
    },
    assetsMap,
    nftList,
  } = useWorkspaceContext();

  const { resolveAddressContactHandle } = useAddressNicknameResolver([
    asset?.to ?? '',
  ]);
  const assetAddressInfo = asset?.to
    ? resolveAddressContactHandle(asset?.to, handle, resolver)
    : undefined;

  const assetInfo = useMemo(
    () =>
      asset?.assetId && assetsMap?.[asset?.assetId]
        ? assetsMap?.[asset?.assetId]
        : assetsMap?.['UNKNOWN'],
    [asset?.assetId],
  );

  const txUSDAmount = useTxAmountToUSD(
    [
      asset
        ? {
            ...asset,
            amount: bn(asset?.amount)?.format({
              units:
                assetsMap[asset?.assetId]?.units ?? assetsMap.UNKNOWN.units,
            }),
          }
        : {
            amount: '',
            assetId: '',
          },
    ],
    tokensUSD?.isLoading,
    tokensUSD?.data,
    tokensUSD?.isUnknownToken,
  );
  const formattedAmount = bn(asset?.amount)?.format({
    units: assetsMap?.[asset?.assetId ?? '']?.units ?? assetsMap.UNKNOWN.units,
  });

  const isNFT = useMemo(() => {
    if (!asset?.assetId) return bn(asset?.amount).eq(bn(1));

    const nftAssetIds = new Set(nftList.map((nft) => nft.assetId));

    return nftAssetIds.has(asset.assetId);
  }, [asset?.assetId, asset?.amount, nftList]);

  const image = useMemo(
    () => (isNFT ? assetInfo?.metadata?.image : assetInfo?.icon),
    [assetInfo?.icon, assetInfo.metadata, isNFT],
  );

  const displayAmount = isNFT ? '1' : formattedAmount;

  const imgUrl = image ?? (assetsMap?.UNKNOWN?.icon || '');

  return (
    <HStack
      py={2}
      justifyContent={{ base: 'space-between' }}
      w="full"
      borderTopWidth={1}
      {...props}
    >
      {assetInfo && (
        <VStack alignItems="start" minW="40px">
          <Image
            w={7}
            h={7}
            src={parseURI(imgUrl)}
            borderRadius="md"
            alt="Asset Icon"
            objectFit="cover"
          />

          <Text fontSize="sm" color="grey.500">
            {assetInfo?.slug}
          </Text>
        </VStack>
      )}

      <VStack mt={0.5} minW={isLitteSmall ? '75px' : '105px'}>
        <Text
          textAlign="center"
          variant={isMobile ? 'title-sm' : 'title-md'}
          color="grey.75"
          fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
        >
          {displayAmount}
        </Text>
        <Text
          textAlign="center"
          variant="description"
          fontSize="xs"
          color="grey.500"
        >
          <AmountUSD amount={txUSDAmount} isNFT={isNFT} />
        </Text>
      </VStack>

      <Center
        p={{ base: 1.5, sm: 3 }}
        borderRadius={5}
        bgColor="grey.825"
        borderWidth={1}
        borderColor="grey.925"
        boxSize="30px"
      >
        <Icon
          color="grey.250"
          fontSize={isDeploy ? '12.8px' : !isContract ? '18px' : '12.8px'}
          as={isDeploy ? DeployIcon : !isContract ? DoubleArrowIcon : FaPlay}
        />
      </Center>

      {asset?.to && (
        <HStack
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ base: isLitteSmall ? 0.5 : 1, xs: 2 }}
          minW={{
            base: isExtraSmall ? '100px' : isLitteSmall ? '125px' : '135px',
            xs: '160px',
            md: '170px',
          }}
        >
          <VStack alignItems="end" spacing={1}>
            {assetAddressInfo?.contact && (
              <Text
                isTruncated
                textOverflow="ellipsis"
                maxW={{
                  base: isExtraSmall
                    ? '75px'
                    : isLitteSmall
                      ? '100px'
                      : '110px',
                  xs: '130px',
                  lg: '130px',
                }}
                color="grey.75"
                fontSize={isLowerThanFourHundredAndThirty ? 'xs' : 'sm'}
              >
                {assetAddressInfo?.contact}
              </Text>
            )}

            {!assetAddressInfo?.contact && !assetAddressInfo?.handle && (
              <Address
                value={asset?.to}
                color={assetAddressInfo?.contact ? 'grey.500' : 'grey.75'}
              />
            )}

            {assetAddressInfo?.handle && (
              <Handle
                value={assetAddressInfo.handle}
                isTruncated
                textOverflow="ellipsis"
                maxW={{
                  base: isExtraSmall ? '50px' : isLitteSmall ? '75px' : '85px',
                  xs: '105px',
                  lg: '105px',
                }}
              />
            )}
          </VStack>

          <AddressActions
            address={asset.to}
            handle={assetAddressInfo?.handle}
            hasContact={!!assetAddressInfo?.contact}
          />
        </HStack>
      )}
    </HStack>
  );
};

export { AssetBoxInfo };
