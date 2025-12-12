import {
  Box,
  Center,
  HStack,
  Icon,
  Image,
  Stack,
  type StackProps,
  Text,
  VStack,
} from 'bako-ui';
import { bn } from 'fuels';
import { memo, useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

import { Address, DoubleArrowIcon, Handle } from '@/components';
import { DeployIcon } from '@/components/icons/tx-deploy';
import { useAssetMap } from '@/modules/assets-tokens/hooks/useAssetMap';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import {
  AddressUtils,
  type AssetModel,
  type IRampTransaction,
} from '@/modules/core';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { FIAT_CURRENCIES_ASSET_IDS } from '@/modules/core/utils/fiat-currencies';
import { parseURI } from '@/modules/core/utils/formatter';
import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
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

const AssetBoxInfo = memo(
  ({
    asset,
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
      screenSizes: { isExtraSmall, isLitteSmall },
      nftList,
      assetsMap,
    } = useWorkspaceContext();
    const { currentNetwork } = useNetworks();
    const { getAssetInfo } = useAssetMap(currentNetwork.chainId);

    const { resolveAddressContactHandle } = useAddressNicknameResolver([
      asset?.to ?? '',
    ]);
    const assetAddressInfo = useMemo(
      () =>
        asset?.to
          ? resolveAddressContactHandle(asset?.to, handle, resolver)
          : undefined,
      [asset?.to, handle, resolver, resolveAddressContactHandle],
    );

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
    const formattedAmount = useMemo(
      () =>
        bn(asset?.amount)?.format({
          units:
            assetsMap?.[asset?.assetId ?? '']?.units ?? assetsMap.UNKNOWN.units,
        }),
      [asset?.amount, asset?.assetId, assetsMap],
    );

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

    const imgUrl = useMemo(
      () => image ?? (assetsMap?.UNKNOWN?.icon || ''),
      [image, assetsMap],
    );

    const amount = useMemo(
      () =>
        isFiatCurrency && rampTransaction?.fiatAmountInUsd
          ? moneyFormat(rampTransaction?.fiatAmountInUsd?.toString())
          : txUSDAmount,
      [isFiatCurrency, rampTransaction?.fiatAmountInUsd, txUSDAmount],
    );

    const provider = useMemo(
      () =>
        isFiatCurrency ? rampTransaction?.providerTransaction || '-' : null,
      [isFiatCurrency, rampTransaction?.providerTransaction],
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
        p={4}
        justifyContent={{ base: 'space-between' }}
        w="full"
        rounded="lg"
        bg="bg.muted"
        mb={1}
        _last={{
          mb: 0,
        }}
        direction={{
          base: !rampTransaction ? 'row' : 'column',
          sm: 'row',
        }}
        {...props}
        border="none"
      >
        <HStack
          justifyContent={{ base: 'space-between', sm: 'flex-start' }}
          w="full"
        >
          {assetInfo && (
            <VStack alignItems="start" minW="40px">
              {bridgeImgNet ? (
                <Box position="relative" w={6} h={6}>
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
                    borderColor="bg.panel"
                  />
                </Box>
              ) : (
                <Image
                  w={6}
                  h={6}
                  src={parseURI(imgUrl)}
                  borderRadius="md"
                  alt="Asset Icon"
                  objectFit="cover"
                />
              )}
            </VStack>
          )}

          <VStack flex={1}>
            <Text
              textAlign="center"
              color="textPrimary"
              fontSize="xs"
              lineHeight="100%"
            >
              {displayAmount} {assetInfo?.slug}
            </Text>
            {FIAT_CURRENCIES_ASSET_IDS.USD !== asset?.assetId && (
              <Text
                textAlign="center"
                fontSize="xs"
                color="gray.400"
                lineHeight="100%"
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
                sm: '200px',
              }}
              alignItems={{
                base: 'start',
                sm: 'end',
              }}
            >
              <Text color="textPrimary" fontSize="xs">
                {paymentMethodOrProvider}
              </Text>
              <Text color="gray.400" fontSize="xs">
                {isFiatCurrency ? 'Founds via' : 'Quote By'}
              </Text>
            </Stack>
          )}

          <Center>
            <Icon
              color="gray.400"
              boxSize={isDeploy ? '12.8px' : !isContract ? '18px' : '12.8px'}
              as={
                isDeploy ? DeployIcon : !isContract ? DoubleArrowIcon : FaPlay
              }
            />
          </Center>

          {(asset?.to || isFiatCurrency) && (
            <HStack
              alignItems="center"
              justifyContent="flex-end"
              gap={{ base: isLitteSmall ? 0.5 : 1, sm: 2 }}
              minW={{
                base: isExtraSmall ? '100px' : isLitteSmall ? '125px' : '135px',
                sm: '160px',
                md: '200px',
              }}
            >
              <VStack alignItems="center" gap={1} flex={1}>
                {provider && (
                  <Stack gap={0} alignItems="end">
                    <Text
                      truncate
                      textOverflow="ellipsis"
                      maxW={{
                        base: isExtraSmall
                          ? '75px'
                          : isLitteSmall
                            ? '100px'
                            : '110px',
                        sm: '130px',
                        lg: '130px',
                      }}
                      color="textPrimary"
                      fontSize="xs"
                    >
                      {provider}
                    </Text>
                    {isFiatCurrency && (
                      <Text color="gray.500" as="span" fontSize="xs">
                        Quote By
                      </Text>
                    )}
                  </Stack>
                )}

                <Stack
                  gap={1}
                  justifyItems="center"
                  alignItems="center"
                  flex={1}
                >
                  {assetAddressInfo?.handle && (
                    <Handle
                      value={assetAddressInfo.handle}
                      truncate
                      alignSelf="center"
                    />
                  )}
                  {asset?.to && (
                    <Address
                      value={asset.to}
                      customValue={AddressUtils.format(asset.to, 5)}
                      color={
                        assetAddressInfo?.contact || assetAddressInfo?.handle
                          ? 'gray.400'
                          : 'textPrimary'
                      }
                    />
                  )}
                </Stack>
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
  },
);

AssetBoxInfo.displayName = 'AssetBoxInfo';

export { AssetBoxInfo };
