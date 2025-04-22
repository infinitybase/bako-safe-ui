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
  Skeleton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import NftEmpty from '@/assets/nft-empty.svg';
import { AddressWithCopyBtn, Card, Dialog } from '@/components';
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
      flex={1}
      minW="fit-content"
      w="full"
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

const NftBalanceCard = ({ nft }: { nft: NFT }) => {
  const {
    nftList,
    screenSizes: { isLitteSmall },
  } = useWorkspaceContext();

  const { nftsInfo, nftImageUrl } = useGetNftsInfos({
    assetId: nft.assetId,
    nftList,
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!nftsInfo) return null;

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
        onClick={() => setDialogOpen(true)}
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

          <Text
            fontSize={isLitteSmall ? 'xs' : 'sm'}
            color="grey.50"
            maxW="full"
            isTruncated
          >
            {nftsInfo?.symbol || nftsInfo?.name || nftsInfo.metadata.name
              ? `${nftsInfo?.symbol || ''} ${nftsInfo?.name || nftsInfo.metadata.name || ''}`.trim()
              : AddressUtils.format(nftsInfo?.assetId, 10)}
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
          alignItems={{ base: 'center', md: 'flex-start' }}
        >
          <Box
            w={{ base: 'full', md: 'auto' }}
            maxW={{ base: 'full', sm: '400px' }}
            position="relative"
            borderRadius="xl"
            overflow="hidden"
          >
            {!modalImageLoaded && (
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
              src={nftImageUrl || NftEmpty}
              alt="NFT image"
              borderRadius="xl"
              onLoad={() => setModalImageLoaded(true)}
              opacity={modalImageLoaded ? 1 : 0}
              transition="opacity 0.3s ease"
            />
            <Flex direction="row" wrap="wrap" gap={3} mt={3}>
              <NFTText
                value={nftsInfo.assetId ?? ''}
                title="Asset ID"
                isCopy
                icon={<BTCIcon />}
              />
              <NFTText
                value={nftsInfo.contractId ?? ''}
                title="Contract Address"
                isCopy
                icon={<ContractIcon />}
              />
            </Flex>
          </Box>

          <VStack
            maxW="full"
            flex={1}
            justifyContent="space-between"
            alignItems="flex-start"
            ml={{ base: 0, md: 6 }}
            h="full"
          >
            <Flex
              w="full"
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Heading fontSize="xl">
                {nftsInfo?.name || nftsInfo?.metadata.name || 'NFT Details'}
              </Heading>
              <CloseButton
                onClick={() => setDialogOpen(false)}
                w="min-content"
                h="min-content"
              />
            </Flex>

            <Box flex={1} mt={6} maxH="calc(100vh - 300px)" overflowY="auto">
              <Box mb={6}>
                <Heading fontSize="md">Description</Heading>
                <Text mt={3} fontSize="sm" color="section.500">
                  {nftsInfo?.description ||
                    nftsInfo.metadata?.description ||
                    'Description not provided.'}
                </Text>
              </Box>

              <Box mb={6}>
                <Heading fontSize="md">Metadata</Heading>
                <Flex
                  w="full"
                  maxH="260px"
                  overflowY="auto"
                  direction="row"
                  wrap="wrap"
                  gap={3}
                  mt={3}
                  sx={{
                    '&::-webkit-scrollbar': {
                      width: '6px',
                      backgroundColor: 'grey.900',
                      borderRadius: '30px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'brand.500',
                      borderRadius: '30px',
                    },
                  }}
                >
                  {nftsInfo.metadata?.attributes?.map((attr) => (
                    <NFTText
                      key={attr.trait_type}
                      value={attr.trait_type}
                      title={`attributes: ${attr.trait_type}`}
                    />
                  ))}

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
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
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
