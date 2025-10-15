import { Icon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  HStack,
  Image,
  Stack,
  type StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

import { Address, DoubleArrowIcon, Handle } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useAssetMap } from '@/modules/assets-tokens/hooks/useAssetMap';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import type { AssetModel, IRampTransaction } from '@/modules/core';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { FIAT_CURRENCIES_ASSET_IDS } from '@/modules/core/utils/fiat-currencies';
import { parseURI } from '@/modules/core/utils/formatter';
import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { moneyFormat } from '@/utils/money-format';

import { AmountUSD } from './transfer-details';
import { AddressActions } from './transfer-details/address-actions';

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  isDeposit?: boolean;
  isDeploy?: boolean;
  isContract?: boolean;
  handle?: string;
  resolver?: string;
  rampTransaction?: IRampTransaction;
  isFiatCurrency?: boolean;
  bridgeImgNet?: string;
}

const AssetBoxInfo = ({
  asset,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isDeposit,
  isDeploy,
  isContract,
  handle,
  resolver,
  rampTransaction,
  isFiatCurrency = false,
  bridgeImgNet,
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
    nftList,
    assetsMap,
  } = useWorkspaceContext();
  const { currentNetwork } = useNetworks();
  const { getAssetInfo } = useAssetMap(currentNetwork.chainId);

  const { resolveAddressContactHandle } = useAddressNicknameResolver([
    asset?.to ?? '',
  ]);
  const assetAddressInfo = asset?.to
    ? resolveAddressContactHandle(asset?.to, handle, resolver)
    : undefined;

  const assetInfo = useMemo(() => {
    return getAssetInfo(asset?.assetId ?? '');
  }, [asset?.assetId, getAssetInfo]);

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
    () =>
      isNFT
        ? assetInfo?.metadata?.image || assetInfo?.metadata?.['image:png']
        : assetInfo?.icon,
    [assetInfo?.icon, assetInfo.metadata, isNFT],
  );
  const onRampAmount = useMemo(
    () =>
      rampTransaction?.sourceAmount && isFiatCurrency
        ? moneyFormat(
            rampTransaction.sourceAmount,
            rampTransaction.sourceCurrency,
          )
        : null,
    [rampTransaction, isFiatCurrency],
  );
  const displayAmount = isNFT ? '1' : onRampAmount || formattedAmount;

  const imgUrl = image ?? (assetsMap?.UNKNOWN?.icon || '');

  const amount = useMemo(
    () =>
      isFiatCurrency && rampTransaction?.fiatAmountInUsd
        ? moneyFormat(rampTransaction?.fiatAmountInUsd?.toString())
        : txUSDAmount,
    [isFiatCurrency, rampTransaction?.fiatAmountInUsd, txUSDAmount],
  );

  const contactOrProvider = useMemo(
    () =>
      isFiatCurrency
        ? rampTransaction?.providerTransaction || '-'
        : assetAddressInfo?.contact,
    [
      isFiatCurrency,
      rampTransaction?.providerTransaction,
      assetAddressInfo?.contact,
    ],
  );

  const paymentMethodOrProvider = useMemo(
    () =>
      isFiatCurrency
        ? rampTransaction?.paymentMethod
        : rampTransaction?.providerTransaction,
    [
      isFiatCurrency,
      rampTransaction?.paymentMethod,
      rampTransaction?.providerTransaction,
    ],
  );

  return (
    <Stack
      py={2}
      justifyContent={{ base: 'space-between' }}
      w="full"
      borderTopWidth={1}
      direction={{
        base: !rampTransaction ? 'row' : 'column',
        xs: 'row',
      }}
      {...props}
    >
      <HStack
        justifyContent={{ base: 'space-between', xs: 'flex-start' }}
        w="full"
      >
        {assetInfo && (
          <VStack alignItems="start" minW="40px">
            {bridgeImgNet ? (
              <Box position="relative" w={7} h={7}>
                <Image
                  w="full"
                  h="full"
                  src={parseURI(imgUrl)}
                  alt="Asset Icon"
                  objectFit="cover"
                  borderRadius="full"
                />

                <Image
                  w={4}
                  h={4}
                  src={parseURI(bridgeImgNet)}
                  borderRadius="full"
                  objectFit="cover"
                  position="absolute"
                  bottom={-1}
                  right={-1}
                  border="2px solid"
                  borderColor="gray.900"
                />
              </Box>
            ) : (
              <Image
                w={7}
                h={7}
                src={parseURI(imgUrl)}
                borderRadius="md"
                alt="Asset Icon"
                objectFit="cover"
              />
            )}

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
          {FIAT_CURRENCIES_ASSET_IDS.USD !== asset?.assetId && (
            <Text
              textAlign="center"
              variant="description"
              fontSize="xs"
              color="grey.500"
            >
              <AmountUSD amount={amount} isNFT={isNFT} />
            </Text>
          )}
        </VStack>
      </HStack>

      <HStack justifyContent="space-between" w="full">
        {paymentMethodOrProvider && (
          <Stack
            gap={0}
            minW={{
              base: 'auto',
              xs: '200px',
            }}
            alignItems={{
              base: 'start',
              xs: 'end',
            }}
          >
            <Text color="grey.75" fontSize="xs">
              {paymentMethodOrProvider}
            </Text>
            <Text color="grey.500" fontSize="2xs">
              {isFiatCurrency ? 'Founds via' : 'Quote By'}
            </Text>
          </Stack>
        )}

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

        {(asset?.to || isFiatCurrency) && (
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
              {contactOrProvider && (
                <Stack gap={0} alignItems="end">
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
                    {contactOrProvider}
                  </Text>
                  {isFiatCurrency && (
                    <Text color="grey.500" as="span" fontSize="2xs">
                      Quote By
                    </Text>
                  )}
                </Stack>
              )}

              {!assetAddressInfo?.contact &&
                !assetAddressInfo?.handle &&
                asset?.to && (
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
                    base: isExtraSmall
                      ? '50px'
                      : isLitteSmall
                        ? '75px'
                        : '85px',
                    xs: '105px',
                    lg: '105px',
                  }}
                />
              )}
            </VStack>

            {asset?.to && (
              <AddressActions
                address={asset.to}
                handle={assetAddressInfo?.handle}
                hasContact={!!assetAddressInfo?.contact}
              />
            )}
          </HStack>
        )}
      </HStack>
    </Stack>
  );
};

export { AssetBoxInfo };
