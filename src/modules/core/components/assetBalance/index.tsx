import {
  Box,
  Center,
  CloseButton,
  Flex,
  FlexProps,
  Grid,
  Heading,
  Icon,
  Image,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AddressWithCopyBtn, Card, CustomSkeleton, Dialog } from '@/components';
import { BTCIcon } from '@/components/icons/btc-icon';
import { ContractIcon } from '@/components/icons/contract-icon';
import { AddressUtils, Asset, NFT } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetNftsInfos, useGetTokenInfos, useScreenSize } from '../../hooks';

interface AssetsBalanceProps {
  assets: Asset[];
}

interface NftsBalanceProps {
  nfts?: NFT[];
}

type NFTTextProps = {
  value: string;
  title: string;
  icon?: React.ReactNode;
  isCopy?: boolean;
} & FlexProps;

const NFTText = ({ value, title, icon, isCopy, ...rest }: NFTTextProps) => {
  return (
    <Flex
      minW="fit-content"
      w="auto"
      p={2}
      gap={3}
      alignItems="center"
      borderRadius="md"
      bg="grey.925"
      position="relative"
      {...rest}
    >
      {icon && <Icon fontSize={25}>{icon}</Icon>}
      <Box>
        <Text fontSize="xs" color="section.500">
          {title}
        </Text>
        <Flex gap={2}>
          {isCopy ? (
            <AddressWithCopyBtn value={value} isDetailDialog />
          ) : (
            <Text fontSize="sm" color={'white'} wordBreak="break-word">
              {value}
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

const FALLBACK_TIMEOUT = 5000;
const NftEmpty = '/nft-empty.svg';

export const NftBalanceCard = ({ nft }: { nft: NFT }) => {
  const {
    nftList,
    screenSizes: { isLitteSmall },
  } = useWorkspaceContext();

  const { nftsInfo, nftImageUrl } = useGetNftsInfos({
    assetId: nft.assetId,
    nftList,
  });

  const [imageSrc, setImageSrc] = useState<string>(nftImageUrl || NftEmpty);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadImage = (src: string, fallback: string, setSrc: (v: string) => void, setLoaded: (v: boolean) => void) => {
    setLoaded(false);

    const img = new window.Image();

    const handleLoad = () => {
      clearTimeout(timeoutRef.current!);
      setLoaded(true);
      setSrc(src);
    };

    const handleError = () => {
      clearTimeout(timeoutRef.current!);
      setLoaded(true);
      setSrc(fallback);
    };

    timeoutRef.current = setTimeout(() => {
      handleError();
    }, FALLBACK_TIMEOUT);

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;

    if (img.complete) {
      clearTimeout(timeoutRef.current!);
      handleLoad();
    }
  };

  useEffect(() => {
    if (nftImageUrl) {
      loadImage(nftImageUrl, NftEmpty, setImageSrc, setImageLoaded);
    } else {
      setImageSrc(NftEmpty);
      setImageLoaded(true);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [nftImageUrl]);

  if (!nftsInfo) return null;

  const renderImage = (loaded: boolean, setLoaded: (v: boolean) => void, src: string) => (
    <>
      {!loaded && (
        <>
          <CustomSkeleton
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
            <Spinner thickness="3px" speed="0.5s" color="grey.400" size="md" />
          </Center>
        </>
      )}
      <Image
        w="full"
        h="full"
        src={src}
        borderRadius={5}
        alt="NFT Image"
        objectFit="cover"
        opacity={loaded ? 1 : 0}
        transition="opacity 0.3s ease"
        position="absolute"
        top={0}
        left={0}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(true);
          setImageSrc(NftEmpty);
        }}
      />
    </>
  );

  return (
    <>
      <Card
        p={isLitteSmall ? 1 : 2}
        borderRadius={isLitteSmall ? 5 : 8}
        borderWidth="1px"
        borderColor="gradients.transaction-border"
        backgroundColor="dark.50"
        backgroundImage="gradients.transaction-card"
        backdropFilter="blur(6px)"
        boxShadow="lg"
        onClick={() => {
          setDialogOpen(true);
          loadImage(nftImageUrl || '', NftEmpty, setImageSrc, setModalImageLoaded);
        }}
        cursor="pointer"
      >
        <VStack alignItems="flex-start" gap={isLitteSmall ? 1 : 2}>
          <Box
            w="full"
            aspectRatio={1}
            borderRadius={5}
            position="relative"
            overflow="hidden"
          >
            {renderImage(imageLoaded, setImageLoaded, imageSrc)}
          </Box>
          <Text
            fontSize={isLitteSmall ? 'xs' : 'sm'}
            color="grey.50"
            maxW="full"
            isTruncated
          >
            {nftsInfo.symbol || nftsInfo.name || nftsInfo.metadata.name
              ? `${nftsInfo.symbol || ''} ${nftsInfo.name || nftsInfo.metadata.name || ''}`.trim()
              : AddressUtils.format(nftsInfo.assetId, 10)}
          </Text>
        </VStack>
      </Card>

      <Dialog.Modal
        size={{ base: '5xl', md: '4xl' }}
        onClose={() => setDialogOpen(false)}
        isOpen={dialogOpen}
      >
        <Dialog.Body
          h="full"
          display="flex"
          flexDirection={{ base: 'column-reverse', md: 'row' }}
          alignItems={{ base: 'center', md: 'stretch' }}
          justifyContent="space-between"
          gap={6}
          pt={3}
          pl={3}
          pr={3}
        >
          <Box
            w="432px"
            flexShrink={0}
            position="relative"
            borderRadius="xl"
            overflow="hidden"
          >
            <Box w="full" aspectRatio={1} position="relative">
              {renderImage(modalImageLoaded, setModalImageLoaded, imageSrc)}
            </Box>

            <Flex
              direction="row"
              wrap="wrap"
              gap={3}
              mt={3}
              justifyContent="space-between"
              w="full"
            >
              <NFTText
                value={nftsInfo.assetId ?? ''}
                title="Asset ID"
                isCopy
                icon={<BTCIcon />}
                flex="1"
                minW="200px"
              />
              <NFTText
                value={nftsInfo.contractId ?? ''}
                title="Contract Address"
                isCopy
                icon={<ContractIcon />}
                flex="1"
                minW="200px"
              />
            </Flex>
          </Box>

          <VStack
            flex={1}
            justifyContent="space-between"
            alignItems="flex-start"
            h="full"
          >
            <Flex w="full" alignItems="center" justifyContent="space-between">
              <Heading fontSize="xl" noOfLines={1}>
                {nftsInfo.name || nftsInfo.metadata.name || 'NFT Details'}
              </Heading>
              <CloseButton onClick={() => setDialogOpen(false)} />
            </Flex>

            <Box
              flex={1}
              mt={6}
              maxH="calc(100vh - 300px)"
              overflowY="auto"
              pr={3}
              sx={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                  backgroundColor: 'grey.900',
                  borderRadius: '30px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'brand.500',
                  borderRadius: '30px',
                },
              }}
            >
              <Box mb={6}>
                <Heading fontSize="md">Description</Heading>
                <Text mt={3} fontSize="sm" color="section.500">
                  {nftsInfo.description ||
                    nftsInfo.metadata?.description ||
                    'Description not provided.'}
                </Text>
              </Box>

              <Box mb={3}>
                <Heading fontSize="md">Metadata</Heading>
                <Flex
                  maxH={{ base: 'none', md: '294px' }}
                  overflowY={{ base: 'hidden', md: 'auto' }}
                  direction="row"
                  wrap="wrap"
                  gap={3}
                  mt={7}
                  pr={2}
                  sx={{
                    '&::-webkit-scrollbar': {
                      width: '5px',
                      backgroundColor: 'grey.900',
                      borderRadius: '30px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'brand.500',
                      borderRadius: '30px',
                    },
                  }}
                >
                  {Object.entries(nftsInfo.metadata || {})
                    .filter(
                      ([key]) =>
                        key !== 'name' &&
                        key !== 'description' &&
                        key !== 'attributes',
                    )
                    .map(([key, value]) => (
                      <NFTText key={key} value={String(value)} title={key} />
                    ))}
                  {nftsInfo.metadata?.attributes?.map((attr) => (
                    <NFTText
                      key={attr.trait_type}
                      value={attr.trait_type}
                      title={`attributes: ${attr.trait_type}`}
                    />
                  ))}

                  {!nftsInfo.metadata?.attributes?.length &&
                    Object.entries(nftsInfo.metadata || {}).filter(
                      ([key]) =>
                        key !== 'name' &&
                        key !== 'description' &&
                        key !== 'attributes',
                    ).length === 0 && (
                      <Text fontSize="sm" color="section.500">
                        Empty metadata.
                      </Text>
                    )}
                </Flex>
              </Box>
            </Box>
          </VStack>
        </Dialog.Body>
      </Dialog.Modal>
    </>
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

  const grouped = useMemo(() => {
    if (!nfts) return {};
    return nfts.reduce<Record<string, typeof nfts>>((acc, nft) => {
      const isBakoId = nft.symbol === 'BID' || nft.collection === 'Bako ID';
      const key = isBakoId ? 'Bako ID' : (nft.collection ?? 'Other');
      (acc[key] ??= []).push(nft);
      return acc;
    }, {});
  }, [nfts]);


  return (
    <>
      {Object.entries(grouped).map(([group, groupNfts]) => (
        <div key={group}>
          <h2 style={{ margin: '1rem 0' }}>
            {group === 'BID' ? 'Bako ID' : group}
          </h2>
          <Grid
            gap={4}
            templateColumns={
              isLitteSmall
                ? 'repeat(2, 1fr)'
                : {
                    base: 'repeat(3, 1fr)',
                    xs: 'repeat(3, 1fr)',
                    sm: 'repeat(4, 1fr)',
                    md: 'repeat(5, 1fr)',
                    xl: 'repeat(5, 1fr)',
                    '2xl': 'repeat(6, 1fr)',
                  }
            }
          >
            {groupNfts.map((nft) => (
              <NftBalanceCard key={nft.assetId} nft={nft} />
            ))}
          </Grid>
        </div>
      ))}
    </>
  );
};

export { AssetsBalanceList, NftsBalanceList };
