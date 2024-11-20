import { BakoIcon } from '@bako-safe/ui';
import {
  Card,
  type CardProps,
  Flex,
  Icon,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';

import { networkService } from '@/config/services-initializer';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetTokenInfos } from '../../hooks';
import { type Asset, NativeAssetId } from '../../utils';
import { AssetDetails } from './AssetDetails';

interface AssetCardProps extends CardProps {
  asset: Asset;
  isNFT?: boolean;
  visibleBalance?: boolean;
}

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
    amount: '0',
  };

  const { assetAmount, assetsInfo } = useGetTokenInfos({
    ...asset,
    assetsMap,
  });

  // TODO: Abstract to avoid duplicated code
  const redirectToNetwork = () =>
    window.open(
      `${networkService.getExplorer(network.url)}/account/${vault.data.predicateAddress}/assets`,
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
