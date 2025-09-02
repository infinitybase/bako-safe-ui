import {
  Box,
  Card,
  CardProps,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { css } from '@emotion/react';

import UnknownNft from '/tokens/unknown.svg';
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
import { parseURI } from '../../utils/formatter';

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
  visibleBalance?: boolean;
  assetAmount?: string | null;
  usdAmount?: number | null;
}

interface AssetCardProps extends CardProps {
  asset: Asset & { image?: string };
  isNFT?: boolean;
  usdAmount?: number | null;
  visibleBalance?: boolean;
}

const AssetDetails = ({
  assetName,
  assetSlug,
  defaultAsset,
  isNFT = false,
  handleRedirect,
  visibleBalance,
  assetAmount,
  usdAmount,
}: AssetDetailsProps) => {
  const amount = assetAmount ?? defaultAsset.amount;
  const slug = assetSlug ?? defaultAsset.slug;
  const transactionAmount = Number(amount.replace(/,/g, '')) * (usdAmount ?? 0);

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(transactionAmount);

  return (
    <Box maxW="full" w="full">
      <HStack spacing={1} align="center">
        <Text color="grey.100" fontSize="sm" isTruncated>
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

      {visibleBalance ? (
        <VStack spacing={0} align="start" mt={0} minH={45}>
          <Text color="white" fontWeight="bold" fontSize="sm" noOfLines={1}>
            {isNFT ? (
              '1'
            ) : (
              <>
                {amount}{' '}
                <Text
                  as="span"
                  color="grey.400"
                  fontWeight="medium"
                  fontSize="xs"
                >
                  {slug?.toUpperCase() ?? ''}
                </Text>
              </>
            )}
          </Text>

          {
            <Text fontSize="xs" color="grey.400" minH="1em">
              {transactionAmount > 0 ? formattedAmount : ''}
            </Text>
          }
        </VStack>
      ) : (
        <VStack
          spacing={0}
          display={'flex'}
          align={'start'}
          justify={'center'}
          mt={0}
          minH={45}
        >
          <Text color="white" fontSize="md">
            ------
          </Text>
        </VStack>
      )}
    </Box>
  );
};

const AssetCard = ({
  asset,
  visibleBalance,
  isNFT = false,
  usdAmount,
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

  const nftImage =
    isNFT && asset.image ? (
      <Image
        src={parseURI(asset.image)}
        w={10}
        h={10}
        rounded="md"
        alt="Asset Icon"
        objectFit="cover"
        fallback={<Image src={UnknownNft} w={10} h={10} />}
      />
    ) : (
      <Icon as={BakoIcon} w={10} h={10} />
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
      aria-label={`${assetsInfo.slug} Asset Card`}
      {...rest}
    >
      <VStack align="flex-start" justify="center" w="full" h="full" spacing={1}>
        <Box mb={4}>
          {isNFT ? (
            nftImage
          ) : (
            <Image
              w={10}
              h={10}
              src={assetsInfo?.icon ?? ''}
              borderRadius="full"
              alt="Asset Icon"
              objectFit="cover"
            />
          )}
        </Box>
        <Box>
          <AssetDetails
            assetName={isNFT ? asset.assetId : assetsInfo.name}
            assetSlug={assetsInfo.slug}
            defaultAsset={defaultAsset}
            isNFT={isNFT}
            handleRedirect={redirectToNetwork}
            visibleBalance={visibleBalance}
            assetAmount={assetAmount}
            usdAmount={usdAmount}
          />
        </Box>
      </VStack>
    </Card>
  );
};

export { AssetCard };
