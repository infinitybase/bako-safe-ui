import {
  Avatar,
  AvatarGroup,
  Box,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';
import { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';

import { assetsMap, NativeAssetId } from '@/modules/core';
import { useScreenSize } from '@/modules/core/hooks';

interface TransactionCardAmountProps {
  assets: ITransferAsset[];
}

const Amount = ({ assets }: TransactionCardAmountProps) => {
  const { isMobile } = useScreenSize();

  const ethAmount = assets
    .filter((a) => a.assetId === NativeAssetId)
    .reduce((total, asset) => total.add(bn.parseUnits(asset.amount)), bn(0))
    .format();

  return (
    <HStack
      alignItems="center"
      justifyContent="flex-start"
      w={{ base: 'full', sm: 160 }}
      ml={0}
    >
      <AvatarGroup max={2}>
        <Avatar name="ETH" src={assetsMap[NativeAssetId].icon} />
      </AvatarGroup>
      <Box w="full" mt={0.5} textAlign="left">
        <Heading variant={isMobile ? 'title-sm' : 'title-md'} color="grey.200">
          {ethAmount}
        </Heading>
        <Text
          variant="description"
          fontSize={{ base: 'xs', sm: 'sm' }}
          color="grey.500"
        >
          Amount sent
        </Text>
      </Box>
    </HStack>
  );
};

export { Amount };
