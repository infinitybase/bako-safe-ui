import {
  Card,
  Grid,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { css } from '@emotion/react';

import { UpRightArrow } from '@/components';
import {
  AddressUtils,
  Asset,
  NFT,
  shakeAnimationY,
  UNKNOWN_ASSET,
} from '@/modules/core/utils';
import { NetworkService } from '@/modules/network/services';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetNftsInfos, useGetTokenInfos } from '../../hooks';

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
  } = useWorkspaceContext();

  const { nftsInfo, nftImageUrl } = useGetNftsInfos({
    assetId: nft.assetId,
    nftList,
    name: nft.name,
  });
  const redirectToNetwork = () =>
    window.open(
      `${NetworkService.getExplorer(network.url)}/account/${vault.data.predicateAddress}/assets`,
      '_BLANK',
    );
  if (!nftsInfo) {
    return '';
  }
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
      <VStack alignItems="flex-start" gap={2}>
        <Image
          w="full"
          h="auto"
          src={nftImageUrl || UNKNOWN_ASSET.icon}
          borderRadius={5}
          alt="NFT Image"
          objectFit="cover"
        />
        <VStack alignItems="flex-start" gap={0} maxW="full">
          <HStack>
            <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
              {AddressUtils.format(nft.assetId ?? '', 10)}
            </Text>
            <IconButton
              icon={
                <Icon
                  className="nft-icon-1"
                  as={UpRightArrow}
                  fontSize="md"
                  color="grey.75"
                />
              }
              aria-label="Explorer"
              size="xs"
              minW={2}
              bg="none"
              h={3}
              _hover={{ bg: 'none' }}
              css={css`
                &:hover .nft-icon-1 {
                  animation: ${shakeAnimationY} 0.5s ease-in-out;
                }
              `}
              onClick={redirectToNetwork}
            />
          </HStack>
        </VStack>
        <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
          {nftsInfo?.name || 'NFT'}
        </Text>
      </VStack>
    </Card>
  );
};

const AssetsBalanceCard = ({ asset }: { asset: Asset }) => {
  const { assetsMap } = useWorkspaceContext();
  const { assetAmount, assetsInfo } = useGetTokenInfos({ ...asset, assetsMap });
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
      <VStack alignItems="flex-start" gap={2}>
        <Image
          w={{ base: 8, sm: 10 }}
          h={{ base: 8, sm: 10 }}
          src={assetsInfo?.icon}
          borderRadius={100}
          alt="Asset Icon"
          objectFit="cover"
        />
        <VStack alignItems="flex-start" gap={0} maxW="full">
          <HStack>
            <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
              {assetsInfo?.name}
            </Text>
          </HStack>
          <Text fontSize="xs" color="grey.250">
            {assetsInfo?.slug}
          </Text>
        </VStack>
        <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
          {assetAmount}
        </Text>
      </VStack>
    </Card>
  );
};

const AssetsBalanceList = ({ assets }: AssetsBalanceProps) => (
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
    {assets.map((asset) => (
      <AssetsBalanceCard key={asset.assetId} asset={asset} />
    ))}
  </Grid>
);

const NftsBalanceList = ({ nfts }: NftsBalanceProps) => (
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
    {nfts?.map((nft) => <NftBalanceCard key={nft.assetId} nft={nft} />)}
  </Grid>
);

export { AssetsBalanceList, NftsBalanceList };
