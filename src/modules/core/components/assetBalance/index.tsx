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

import { UpRightArrow } from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';
import { AddressUtils, Asset } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useGetTokenInfos } from '../../hooks';

interface AssetsBalanceProps {
  assets: Asset[];
}

interface AssetsBalanceCardProps {
  asset: Asset;
}

const AssetsBalanceCard = ({ asset }: AssetsBalanceCardProps) => {
  const { assetsMap, isNFTCheck } = useWorkspaceContext();
  const { assetAmount, assetsInfo } = useGetTokenInfos({
    ...asset,
    assetsMap,
  });

  const isNFT = isNFTCheck(asset);

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
        <VStack alignItems="flex-start" gap={0} maxW="full">
          <HStack>
            <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
              {isNFT
                ? AddressUtils.format(asset.assetId ?? '', 20)
                : assetsInfo.name}
            </Text>
            {isNFT && (
              <IconButton
                icon={<Icon as={UpRightArrow} fontSize="md" color="grey.75" />}
                aria-label="Explorer"
                size="xs"
                minW={2}
                bg="none"
                h={3}
                _hover={{ bg: 'none' }}
                // onClick={redirectToNetwork}
              />
            )}
          </HStack>
          <Text fontSize="xs" color="grey.250">
            {isNFT ? 'NFT' : assetsInfo.slug}
          </Text>
        </VStack>
        <Text fontSize="sm" color="grey.50" maxW="full" isTruncated>
          {isNFT ? 1 : assetAmount}
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
      {assets.map((asset) => {
        return <AssetsBalanceCard key={asset.assetId} asset={asset} />;
      })}
    </Grid>
  );
};

export { AssetsBalanceList };
