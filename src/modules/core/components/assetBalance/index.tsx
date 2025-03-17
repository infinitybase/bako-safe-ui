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
} from '@/modules/core/utils';
import { NetworkService } from '@/modules/network/services';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetTokenInfos } from '../../hooks';

interface AssetsBalanceProps {
  assets: Asset[];
}
interface NftsBalanceProps {
  nfts?: NFT[];
}

interface AssetsBalanceCardProps {
  asset: Asset | NFT;
  isNFT?: boolean;
}

const AssetsBalanceCard = ({
  asset,
  isNFT = false,
}: AssetsBalanceCardProps) => {
  const { vault } = useVaultInfosContext();
  const {
    assetsMap,
    authDetails: {
      userInfos: { network },
    },
  } = useWorkspaceContext();
  const { assetAmount, assetsInfo, nftImageUrl } = useGetTokenInfos({
    ...asset,
    assetsMap,
  });

  const redirectToNetwork = () =>
    window.open(
      `${NetworkService.getExplorer(network.url)}/account/${vault.data.predicateAddress}/assets`,
      '_BLANK',
    );

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
        {isNFT ? (
          <Image
            w="full"
            h="auto"
            src={nftImageUrl ?? undefined}
            borderRadius={5}
            alt="NFT Image"
            objectFit="cover"
          />
        ) : (
          <Image
            w={{ base: 8, sm: 10 }}
            h={{ base: 8, sm: 10 }}
            src={assetsInfo?.icon}
            borderRadius={100}
            alt="Asset Icon"
            objectFit="cover"
          />
        )}

        <VStack alignItems="flex-start" gap={0} maxW="full">
          <HStack>
            <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
              {isNFT
                ? AddressUtils.format(asset.assetId ?? '', 10)
                : assetsInfo.name}
            </Text>
            {isNFT && (
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
            )}
          </HStack>
          <Text fontSize="xs" color="grey.250">
            {isNFT ? '' : assetsInfo.slug}
          </Text>
        </VStack>
        <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
          {isNFT ? `${assetsInfo.name}` : assetAmount}
        </Text>
      </VStack>
    </Card>
  );
};

const AssetsBalanceList = ({ assets }: AssetsBalanceProps) => {
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
      {assets.map((asset) => (
        <AssetsBalanceCard key={asset.assetId} asset={asset} />
      ))}
    </Grid>
  );
};

const NftsBalanceList = ({ nfts }: NftsBalanceProps) => {
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
      {nfts?.map((nft) => (
        <AssetsBalanceCard key={nft.assetId} asset={nft} isNFT={true} />
      ))}
    </Grid>
  );
};

export { AssetsBalanceList, NftsBalanceList };
