import { Box, Center, Flex, Grid, HStack, Icon, Text, VStack } from 'bako-ui';
import type { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { Address, DoubleArrowIcon, Handle } from '@/components';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { isHex } from '@/utils';

import { AddressActions } from '../transfer-details/address-actions';
import AmountsInfo from './AmountsInfo';
import TokenInfos from './TokenInfos';

interface DetailItemProps {
  asset: ITransferAsset;
  index?: number;
  sentBy: string;
}

const DetailItem = ({ asset, index, sentBy }: DetailItemProps) => {
  const {
    tokensUSD,
    screenSizes: { isMobile, isExtraSmall, isLitteSmall },
    assetsMap,
    nftList,
  } = useWorkspaceContext();
  const txUSDAmount = useTxAmountToUSD(
    [
      {
        ...asset,
        amount: isHex(asset.amount)
          ? bn(asset?.amount)?.format({
              units:
                assetsMap[asset?.assetId ?? '']?.units ??
                assetsMap.UNKNOWN.units,
            })
          : asset.amount,
      },
    ],
    tokensUSD?.isLoading,
    tokensUSD?.data,
    tokensUSD?.isUnknownToken,
  );
  const { resolveAddressContactHandle } = useAddressNicknameResolver();

  const isFirstItem = index === 0;

  const gridColumnsNumber = isMobile ? 1 : 5;

  const from = sentBy ? resolveAddressContactHandle(sentBy) : undefined;
  const to = asset?.to ? resolveAddressContactHandle(asset.to) : undefined;

  const isNFT = useMemo(() => {
    if (!asset?.assetId) return bn(asset?.amount).eq(bn(1));

    const nftAssetIds = new Set(nftList.map((nft) => nft.assetId));

    return nftAssetIds.has(asset.assetId);
  }, [asset?.assetId, asset?.amount, nftList]);

  return (
    <Grid
      gridTemplateColumns={`repeat(${gridColumnsNumber}, 1fr)`}
      alignItems="center"
      w="full"
      borderColor="grey.950"
      borderBottomWidth={1}
      pt={isFirstItem ? '1px' : '9px'}
      pb={2}
    >
      {isMobile ? (
        <VStack w="full" gap="7px">
          <HStack w="100%" justifyContent="space-between" pr="2px">
            <TokenInfos asset={asset} />
            <AmountsInfo
              txUSDAmount={txUSDAmount}
              asset={asset}
              isNFT={isNFT}
            />
          </HStack>
          <Flex justifyContent="space-between" w="full" alignItems="center">
            <HStack
              alignItems="center"
              justifyContent="flex-start"
              gap={{ base: 1, sm: 2 }}
              flex={2}
            >
              <VStack alignItems="start" gap={2}>
                {from?.contact && (
                  <Text
                    truncate
                    textOverflow="ellipsis"
                    maxW={{
                      base: isExtraSmall
                        ? '80px'
                        : isLitteSmall
                          ? '90px'
                          : '125px',
                      sm: '180px',
                      xl: 'full',
                    }}
                    fontSize={isExtraSmall ? 'xs' : 'sm'}
                    textAlign="start"
                    color="grey.75"
                  >
                    {from.contact}
                  </Text>
                )}

                {!from?.contact && !from?.handle && (
                  <Address
                    value={sentBy}
                    isDeposit={true}
                    justifyContent="start"
                    textAlign="start"
                    color={from?.contact ? 'grey.500' : 'grey.75'}
                  />
                )}

                {from?.handle && (
                  <Handle
                    value={from.handle}
                    truncate
                    textOverflow="ellipsis"
                    maxW={{
                      base: isExtraSmall ? '55px' : '65px',
                      sm: '155px',
                      lg: 'full',
                    }}
                  />
                )}
              </VStack>

              <AddressActions
                address={sentBy}
                handle={from?.handle}
                hasContact={!!from?.contact}
              />
            </HStack>

            <Box display="flex" justifyContent="center" flex={1}>
              <Center
                borderRadius={5}
                bgColor="grey.825"
                borderWidth={1}
                borderColor="grey.925"
                boxSize="30px"
              >
                <Icon color="grey.250" fontSize="18px" as={DoubleArrowIcon} />
              </Center>
            </Box>

            <HStack
              alignItems="center"
              justifyContent="flex-end"
              gap={{ base: 1, sm: 2 }}
              flex={2}
            >
              <VStack alignItems="end" gap={2}>
                {to?.contact && (
                  <Text
                    truncate
                    textOverflow="ellipsis"
                    maxW={{
                      base: isExtraSmall
                        ? '80px'
                        : isLitteSmall
                          ? '90px'
                          : '125px',
                      sm: '180px',
                      xl: 'full',
                    }}
                    fontSize={isExtraSmall ? 'xs' : 'sm'}
                    textAlign="end"
                    color="grey.75"
                  >
                    {to.contact}
                  </Text>
                )}

                {!to?.contact && !to?.handle && (
                  <Address
                    value={asset?.to ?? ''}
                    isDeposit={true}
                    color={to?.contact ? 'grey.500' : 'grey.75'}
                  />
                )}

                {to?.handle && (
                  <Handle
                    value={to.handle}
                    truncate
                    textOverflow="ellipsis"
                    maxW={{
                      base: isExtraSmall ? '55px' : '65px',
                      sm: '155px',
                      xl: 'full',
                    }}
                  />
                )}
              </VStack>

              <AddressActions
                address={asset?.to}
                handle={to?.handle}
                hasContact={!!to?.contact}
              />
            </HStack>
          </Flex>
        </VStack>
      ) : (
        <>
          <TokenInfos asset={asset} />
          <AmountsInfo txUSDAmount={txUSDAmount} asset={asset} isNFT={isNFT} />

          <HStack
            alignItems="center"
            justifyContent="flex-end"
            gap={{ base: 1, sm: 2 }}
            minW={220}
          >
            <VStack alignItems="end" gap={1}>
              {from?.contact && (
                <Text
                  truncate
                  textOverflow="ellipsis"
                  maxW="180px"
                  fontSize="sm"
                  color="grey.75"
                >
                  {from.contact}
                </Text>
              )}

              {!from?.contact && !from?.handle && (
                <Address
                  value={sentBy}
                  isDeposit={true}
                  color={from?.contact ? 'grey.500' : 'grey.75'}
                />
              )}

              {from?.handle && (
                <Handle
                  value={from.handle}
                  truncate
                  textOverflow="ellipsis"
                  maxW="155px"
                />
              )}
            </VStack>

            <AddressActions
              address={sentBy}
              handle={from?.handle}
              hasContact={!!from?.contact}
            />
          </HStack>

          <Box display="flex" justifyContent="center" w="full">
            <Center
              borderRadius={5}
              bgColor="grey.825"
              borderWidth={1}
              borderColor="grey.925"
              boxSize="30px"
            >
              <Icon color="grey.250" fontSize="18px" as={DoubleArrowIcon} />
            </Center>
          </Box>

          <HStack
            alignItems="center"
            justifyContent="flex-end"
            gap={{ base: 1, sm: 2 }}
            minW={220}
          >
            <VStack alignItems="end" gap={1}>
              {to?.contact && (
                <Text
                  truncate
                  textOverflow="ellipsis"
                  maxW="180px"
                  fontSize="sm"
                  color="grey.75"
                >
                  {to.contact}
                </Text>
              )}

              {!to?.contact && !to?.handle && (
                <Address
                  value={asset?.to ?? ''}
                  isDeposit={true}
                  color={to?.contact ? 'grey.500' : 'grey.75'}
                />
              )}

              {to?.handle && (
                <Handle
                  value={to.handle}
                  truncate
                  textOverflow="ellipsis"
                  maxW="155px"
                />
              )}
            </VStack>

            <AddressActions
              address={asset?.to}
              handle={to?.handle}
              hasContact={!!to?.contact}
            />
          </HStack>
        </>
      )}
    </Grid>
  );
};
export default DetailItem;
