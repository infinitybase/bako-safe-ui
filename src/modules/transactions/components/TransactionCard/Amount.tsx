import {
  Avatar,
  AvatarGroup,
  Flex,
  HStack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';

import { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';

import { assetsMap } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';
import bakoIcon from '@/assets/tokens/bako.svg';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { CustomSkeleton } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface TransactionCardAmountProps {
  assets: ITransferAsset[];
}

const Amount = ({ assets }: TransactionCardAmountProps) => {
  const [showOnlyOneAsset] = useMediaQuery('(max-width: 400px)');
  const { tokensUSD } = useWorkspaceContext();

  const { isMobile, isExtraSmall } = useScreenSize();

  const totalAmoutSent = assets
    .reduce((total, asset) => total.add(bn.parseUnits(asset.amount)), bn(0))
    .format();

  const oneAssetOfEach = assets.reduce((uniqueAssets, current) => {
    if (!uniqueAssets.find((asset) => asset.assetId === current.assetId)) {
      uniqueAssets.push(current);
    }

    return uniqueAssets;
  }, [] as ITransferAsset[]);

  const isMultiToken = oneAssetOfEach.length >= 2;

  const txUSDAmount = useTxAmountToUSD(
    assets,
    tokensUSD?.isLoading,
    tokensUSD?.data!,
  );

  return (
    <HStack
      alignItems="center"
      justifyContent="flex-start"
      w={isExtraSmall ? 150 : 200}
    >
      <AvatarGroup
        max={showOnlyOneAsset ? 1 : 3}
        w={isMobile ? 'unset' : 56}
        justifyContent={isMobile ? 'start' : 'end'}
        position="relative"
      >
        {oneAssetOfEach.map((asset) => (
          <Avatar
            name={assetsMap[asset.assetId]?.slug ?? 'UKN'}
            src={assetsMap[asset.assetId]?.icon ?? bakoIcon}
            ignoreFallback
            boxSize={24}
            border="none"
          />
        ))}
      </AvatarGroup>
      <Flex
        flexDir={isMultiToken ? 'column-reverse' : 'column'}
        w="full"
        mt={0.5}
        textAlign="center"
      >
        {isMultiToken ? (
          <Text color="grey.425" fontSize="xs">
            Multi-token
          </Text>
        ) : (
          <Text color="grey.75" fontSize="sm">
            {totalAmoutSent}
          </Text>
        )}
        <Text
          variant="description"
          fontSize={isMultiToken ? 'sm' : 'xs'}
          color={isMultiToken ? ' grey.75' : 'grey.425'}
        >
          <CustomSkeleton isLoaded={!tokensUSD?.isLoading}>
            ${txUSDAmount ?? 0}
          </CustomSkeleton>
        </Text>
      </Flex>
    </HStack>
  );
};

export { Amount };
