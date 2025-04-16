import {
  Box,
  Card,
  Center,
  Grid,
  HStack,
  Icon,
  IconButton,
  Image,
  Skeleton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { useState } from 'react';

import NftEmpty from '@/assets/nft-empty.svg';
import { UpRightArrow } from '@/components';
import {
  AddressUtils,
  Asset,
  NFT,
  shakeAnimationY,
} from '@/modules/core/utils';
import { NetworkService } from '@/modules/network/services';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetNftsInfos, useGetTokenInfos, useScreenSize } from '../../hooks';

interface AssetsBalanceProps {
  assets: Asset[];
}

interface NftsBalanceProps {
  nfts?: NFT[];
}

const NftBalanceCard = ({ nft }: { nft: NFT }) => {
  const { vault } = useVaultInfosContext();
  const {
    authDetails: {
      userInfos: { network },
    },
    nftList,
    screenSizes: { isLitteSmall, isSmall },
  } = useWorkspaceContext();

  const { nftsInfo, nftImageUrl } = useGetNftsInfos({
    assetId: nft.assetId,
    nftList,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  const redirectToNetwork = () =>
    window.open(
      `${NetworkService.getExplorer(network.url)}/account/${vault.data.predicateAddress}/assets`,
      '_BLANK',
    );

  if (!nftsInfo) {
    return null;
  }

  return (
    <Card
      p={isLitteSmall ? 1 : 2}
      borderRadius={isLitteSmall ? 5 : 8}
      borderWidth="1px"
      borderColor="grey.950"
      backgroundColor="dark.50"
      backdropFilter="blur(6px)"
      boxShadow="lg"
    >
      <VStack alignItems="flex-start" gap={isLitteSmall ? 1 : 2}>
        <Box
          w="full"
          aspectRatio={1}
          borderRadius={5}
          position="relative"
          overflow="hidden"
        >
          {!imageLoaded && (
            <>
              <Skeleton
                startColor="dark.200"
                endColor="dark.500"
                w="full"
                h="full"
                position="absolute"
                top={0}
                left={0}
                zIndex={0}
              />
              <Center
                w="full"
                h="full"
                position="absolute"
                top={0}
                left={0}
                zIndex={1}
              >
                <Spinner
                  thickness="3px"
                  speed="0.5s"
                  color="grey.400"
                  size="md"
                />
              </Center>
            </>
          )}

          <Image
            w="full"
            h="full"
            src={nftImageUrl || NftEmpty}
            borderRadius={5}
            alt="NFT Image"
            objectFit="cover"
            onLoad={() => setImageLoaded(true)}
            opacity={imageLoaded ? 1 : 0}
            transition="opacity 0.3s ease"
          />
        </Box>
        <VStack alignItems="flex-start" gap={0} maxW="full">
          <HStack width="full" spacing={isLitteSmall ? 1 : 2} align="center">
            <Text
              flex={1}
              fontSize={isSmall ? '11px' : 'sm'}
              color="grey.50"
              noOfLines={1}
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              minWidth={0}
            >
              {AddressUtils.format(
                nft.assetId ?? '',
                isLitteSmall ? 10 : isSmall ? 6 : 10,
              )}
            </Text>
            <IconButton
              icon={
                <Icon
                  className="nft-icon-1"
                  as={UpRightArrow}
                  fontSize={isLitteSmall ? 'xs' : 'md'}
                  color="grey.75"
                />
              }
              aria-label="Explorer"
              size={isLitteSmall ? 'xxs' : 'xs'}
              minW="auto"
              bg="none"
              h="auto"
              _hover={{ bg: 'none' }}
              css={css`
                &:hover .nft-icon-1 {
                  animation: ${shakeAnimationY} 0.5s ease-in-out;
                }
              `}
              onClick={redirectToNetwork}
              flexShrink={0}
            />
          </HStack>
        </VStack>
        <Text
          fontSize={isLitteSmall ? 'xs' : 'sm'}
          color="grey.50"
          maxW="full"
          isTruncated
        >
          {nftsInfo?.name || 'NFT'}
        </Text>
      </VStack>
    </Card>
  );
};

const AssetsBalanceCard = ({
  asset,
  usdAmount,
}: {
  asset: Asset;
  usdAmount: number;
}) => {
  const { assetsMap } = useWorkspaceContext();
  const { assetAmount, assetsInfo } = useGetTokenInfos({ ...asset, assetsMap });

  const transactionAmount = Number(assetAmount) * (usdAmount ?? 0);
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(transactionAmount);

  return (
    <Card
      p={4}
      borderRadius={8}
      borderWidth="1px"
      borderColor="grey.950"
      backgroundColor="dark.50"
      backdropFilter="blur(6px)"
      boxShadow="lg"
    >
      <VStack alignItems="flex-start" gap={4}>
        <Image
          w={{ base: 8, sm: 10 }}
          h={{ base: 8, sm: 10 }}
          src={assetsInfo?.icon}
          borderRadius={100}
          alt="Asset Icon"
          objectFit="cover"
        />
        <VStack alignItems="flex-start" spacing={0} w="full">
          <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
            {assetsInfo?.name}
          </Text>
          <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
            {assetAmount}{' '}
            <Text as="span" color="grey.400" fontSize="xs">
              {assetsInfo?.slug?.toUpperCase() ?? ''}
            </Text>
          </Text>
          <Text fontSize="xs" color="grey.400" minH="1em">
            {transactionAmount > 0 ? formattedAmount : ''}
          </Text>
        </VStack>
      </VStack>
    </Card>
  );
};

const AssetsBalanceList = ({ assets }: AssetsBalanceProps) => {
  const { tokensUSD } = useWorkspaceContext();

  return (
    <Grid
      gap={4}
      templateColumns={{
        base: 'repeat(1, 1fr)',
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
        xl: 'repeat(5, 1fr)',
        '2xl': 'repeat(6, 1fr)',
      }}
    >
      {assets?.map((asset) => {
        const usdData = tokensUSD.data[asset.assetId.toLowerCase()];
        const usdAmount = usdData?.usdAmount ?? null;

        return (
          <AssetsBalanceCard
            key={asset.assetId}
            asset={asset}
            usdAmount={usdAmount}
          />
        );
      })}
    </Grid>
  );
};

const NftsBalanceList = ({ nfts }: NftsBalanceProps) => {
  const { isLitteSmall } = useScreenSize();

  return (
    <Grid
      gap={4}
      templateColumns={
        isLitteSmall
          ? 'repeat(2, 1fr)'
          : {
              base: 'repeat(3, 1fr)',
              xs: 'repeat(3, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              xl: 'repeat(5, 1fr)',
              '2xl': 'repeat(6, 1fr)',
            }
      }
    >
      {nfts?.map((nft) => <NftBalanceCard key={nft.assetId} nft={nft} />)}
    </Grid>
  );
};

export { AssetsBalanceList, NftsBalanceList };
