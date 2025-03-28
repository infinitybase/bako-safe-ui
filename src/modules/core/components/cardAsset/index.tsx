import {
  Box,
  Card,
  CardProps,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { css } from '@emotion/react';

import { UpRightArrow } from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';
import { NetworkService } from '@/modules/network/services';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetTokenInfos } from '../../hooks';
import {
  AddressUtils,
  Asset,
  NativeAssetId,
  shakeAnimationY,
} from '../../utils';

interface DefaultAsset {
  assetId: string;
  amount: string;
  name: string;
  slug: string;
  icon?: string;
}

interface AssetDetailsProps {
  assetName: string;
  assetSlug: string;
  defaultAsset: DefaultAsset;
  isNFT?: boolean;
  handleRedirect?: () => Window | null;
}

interface AssetCardProps extends CardProps {
  asset: Asset;
  isNFT?: boolean;
  visibleBalance?: boolean;
}

const AssetDetails = ({
  assetName,
  assetSlug,
  defaultAsset,
  isNFT = false,
  handleRedirect,
}: AssetDetailsProps) => {
  return (
    <Box maxW={{ base: '70%', lg: 'full' }}>
      <HStack>
        <Text color="grey.100" fontSize={{ base: 'sm', sm: 15 }} isTruncated>
          {isNFT
            ? AddressUtils.format(assetName ?? '', 5)
            : (assetName ?? defaultAsset.name)}
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
            onClick={handleRedirect}
          />
        )}
      </HStack>

      <Text fontWeight="bold" fontSize="xs" color="grey.400">
        {isNFT ? 'NFT' : (assetSlug ?? defaultAsset.slug)}
      </Text>
    </Box>
  );
};

const AssetCard = ({
  asset,
  visibleBalance,
  isNFT = false,
  ...rest
}: AssetCardProps) => {
  const { vault } = useVaultInfosContext();
  const {
    assetsMap,
    authDetails: {
      userInfos: { network },
    },
  } = useWorkspaceContext();

  const defaultAsset = {
    ...assetsMap?.[NativeAssetId],
    assetId: NativeAssetId,
    amount: `0`,
  };

  const { assetAmount, assetsInfo } = useGetTokenInfos({
    ...asset,
    assetsMap,
  });

  // TODO: Abstract to avoid duplicated code
  const redirectToNetwork = () =>
    window.open(
      `${NetworkService.getExplorer(network?.url)}/account/${vault.data.predicateAddress}/assets`,
      '_BLANK',
    );

  return (
    <Card
      bgColor="grey.700"
      borderColor="grey.400"
      borderWidth="1px"
      borderRadius={10}
      px={4}
      py={4}
      w="full"
      h="full"
      {...rest}
    >
      <Flex
        direction={{ base: 'row', lg: 'column' }}
        alignItems="flex-start"
        gap={2}
        mb={1}
      >
        {isNFT ? (
          <Icon as={BakoIcon} w={{ base: 8, sm: 10 }} h={{ base: 8, sm: 10 }} />
        ) : (
          <Image
            w={{ base: 8, sm: 10 }}
            h={{ base: 8, sm: 10 }}
            src={assetsInfo?.icon ?? ''}
            borderRadius={100}
            alt="Asset Icon"
            objectFit="cover"
          />
        )}
        <AssetDetails
          assetName={isNFT ? asset.assetId : assetsInfo.name}
          assetSlug={assetsInfo.slug}
          defaultAsset={defaultAsset}
          isNFT={isNFT}
          handleRedirect={redirectToNetwork}
        />
      </Flex>

      <VStack
        display="flex"
        alignItems="flex-start"
        flexDirection="column"
        justifyContent="center"
        spacing={1}
        gap={-1}
      >
        {visibleBalance ? (
          <Text fontWeight="bold" color="white" maxW="100%" isTruncated>
            {isNFT ? 1 : (assetAmount ?? defaultAsset.amount)}
          </Text>
        ) : (
          <Text color="white" fontSize="md" mr={1}>
            ------
          </Text>
        )}
      </VStack>
    </Card>
  );
};

export { AssetCard };
