import {
  Avatar,
  AvatarGroup,
  Box,
  HStack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';

import { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';

import { assetsMap, NativeAssetId } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';
import BTCIcon from '@/assets/BTCIcon.svg';
import MATIC from '@/assets/POLYGON.svg';

interface TransactionCardAmountProps {
  assets: ITransferAsset[];
}

const Amount = ({ assets }: TransactionCardAmountProps) => {
  const [showOnlyOneAsset] = useMediaQuery('(max-width: 400px)');

  const ethAmount = assets
    .filter((a) => a.assetId === NativeAssetId)
    .reduce((total, asset) => total.add(bn.parseUnits(asset.amount)), bn(0))
    .format();

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

  return (
    <HStack alignItems="center" justifyContent="flex-start" w={150}>
      {oneAssetOfEach.map((asset) => (
        <AvatarGroup max={showOnlyOneAsset ? 1 : 3}>
          <Avatar
            name={assetsMap[asset.assetId].slug}
            src={assetsMap[asset.assetId].icon}
            ignoreFallback
            boxSize={24}
            border="none"
          />
          <Avatar
            name={assetsMap[asset.assetId].slug}
            src={MATIC}
            ignoreFallback
            boxSize={24}
            border="none"
          />
          <Avatar
            name={assetsMap[asset.assetId].slug}
            src={BTCIcon}
            ignoreFallback
            boxSize={24}
            border="none"
          />
          <Avatar
            name={assetsMap[asset.assetId].slug}
            src={assetsMap[asset.assetId].icon}
            ignoreFallback
            boxSize={24}
            border="none"
          />
        </AvatarGroup>
      ))}
      <Box w="full" mt={0.5} textAlign="left">
        <Text color="grey.75">{totalAmoutSent}</Text>
        <Text variant="description" fontSize="sm" color="grey.425">
          $25.00
        </Text>
      </Box>
    </HStack>
  );
};

export { Amount };
