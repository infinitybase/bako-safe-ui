import { Box, Center, Flex, Grid, HStack, Icon, VStack } from 'bako-ui';
import type { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { DoubleArrowIcon } from '@/components';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { isHex } from '@/utils';

import AmountsInfo from './AmountsInfo';
import { DetailItemAddress } from './DetailItemAddress';
import TokenInfos from './TokenInfos';

interface DetailItemProps {
  asset: ITransferAsset;
  sentBy: string;
}

const DetailItem = ({ asset, sentBy }: DetailItemProps) => {
  const {
    tokensUSD,
    screenSizes: { isMobile },
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

  const from = sentBy ? resolveAddressContactHandle(sentBy) : undefined;
  const to = asset?.to ? resolveAddressContactHandle(asset.to) : undefined;

  const isNFT = useMemo(() => {
    if (!asset?.assetId) return bn(asset?.amount).eq(bn(1));

    const nftAssetIds = new Set(nftList.map((nft) => nft.assetId));

    return nftAssetIds.has(asset.assetId);
  }, [asset?.assetId, asset?.amount, nftList]);

  return (
    <Grid
      gridTemplateColumns={{
        base: '1fr',
        sm: isMobile ? '1fr' : 'repeat(5, minmax(0, 1fr))',
      }}
      alignItems="center"
      w="full"
      bg="bg.muted"
      p={4}
      rounded="lg"
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
            <DetailItemAddress
              contact={from?.contact}
              handle={from?.handle}
              address={sentBy}
              justifyContent="flex-start"
              gap={{ base: 1, sm: 2 }}
              flex={2}
            />

            <Box display="flex" justifyContent="center" flex={1}>
              <Center>
                <Icon color="gray.400" boxSize="18px" as={DoubleArrowIcon} />
              </Center>
            </Box>

            <DetailItemAddress
              contact={to?.contact}
              handle={to?.handle}
              address={asset.to}
              alignItems="center"
              justifyContent="flex-end"
              gap={{ base: 1, sm: 2 }}
              flex={2}
            />
          </Flex>
        </VStack>
      ) : (
        <>
          <TokenInfos asset={asset} />
          <AmountsInfo txUSDAmount={txUSDAmount} asset={asset} isNFT={isNFT} />

          <DetailItemAddress
            contact={from?.contact}
            handle={from?.handle}
            address={sentBy}
            justifyContent="center"
          />

          <Box display="flex" justifyContent="center" w="full">
            <Center>
              <Icon color="gray.400" boxSize="18px" as={DoubleArrowIcon} />
            </Center>
          </Box>

          <DetailItemAddress
            contact={to?.contact}
            handle={to?.handle}
            address={asset.to}
            justifyContent="flex-end"
          />
        </>
      )}
    </Grid>
  );
};
export default DetailItem;
