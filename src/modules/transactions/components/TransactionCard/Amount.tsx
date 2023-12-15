import {
  Avatar,
  AvatarGroup,
  Box,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';
import { ITransferAsset } from 'bsafe';
import { bn } from 'fuels';

import { assetsMap, NativeAssetId } from '@/modules/core';

interface TransactionCardAmountProps {
  assets: ITransferAsset[];
}

const Amount = ({ assets }: TransactionCardAmountProps) => {
  const ethAmount = assets
    .filter((a) => a.assetId === NativeAssetId)
    .reduce((total, asset) => total.add(bn.parseUnits(asset.amount)), bn(0))
    .format();

  return (
    <HStack alignItems="center" justifyContent="flex-start" w={250} ml={0}>
      <AvatarGroup max={2}>
        <Avatar name="ETH" src={assetsMap[NativeAssetId].icon} />
      </AvatarGroup>
      <Box w="full" mt={0.5} textAlign="left">
        <Heading variant="title-md" color="grey.200">
          {ethAmount}
        </Heading>
        <Text variant="description" fontSize="sm" color="grey.500">
          Amount sent
        </Text>
      </Box>
    </HStack>
  );
};

export { Amount };
